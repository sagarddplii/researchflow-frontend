import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface ApiOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number; // in seconds
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string, options?: ApiOptions) => Promise<T | null>;
  reset: () => void;
  retry: () => void;
  isRetrying: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export function useApi<T = any>(): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const lastCall = useRef<{ url: string; options?: ApiOptions } | null>(null);

  const execute = useCallback(async (url: string, options?: ApiOptions) => {
    setLoading(true);
    setError(null);
    setData(null);
    lastCall.current = { url, options }; // Store last call for retry

    const { retries = 0, retryDelay = 1000, timeout = 30, ...fetchOptions } = options || {};

    for (let i = 0; i <= retries; i++) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout * 1000); // Convert to milliseconds

      try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions?.headers,
          },
        });
        clearTimeout(id);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
        setIsRetrying(false);
        return result;

      } catch (err: any) {
        clearTimeout(id);
        if (err.name === 'AbortError') {
          setError('Request timed out or was aborted.');
          toast.error('Request timed out or was aborted. Please try again.');
        } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network error: Cannot connect to the server.');
          toast.error('Network error: Cannot connect to the server. Please check if the backend is running.');
        } else {
          setError(err.message || 'An unknown error occurred.');
          toast.error(err.message || 'An unknown error occurred.');
        }

        if (i < retries) {
          setIsRetrying(true);
          toast(`Retrying in ${retryDelay / 1000} seconds... (Attempt ${i + 1}/${retries})`, { id: 'retry-toast', duration: retryDelay });
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          setLoading(false);
          setIsRetrying(false);
          return null;
        }
      }
    }
    return null; // Should not be reached if retries are exhausted and error is thrown
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setIsRetrying(false);
    lastCall.current = null;
  }, []);

  const retry = useCallback(() => {
    if (lastCall.current) {
      execute(lastCall.current.url, { ...lastCall.current.options, retries: 2, retryDelay: 2000 }); // Default retry for manual retry
    } else {
      toast.error('No previous API call to retry.');
    }
  }, [execute]);

  return { data, loading, error, execute, reset, retry, isRetrying };
}

export function useResearchPipeline() {
  const { data, loading, error, execute, reset, retry, isRetrying } = useApi<any>();
  return { data, loading, error, execute, reset, retry, isRetrying };
}

// Health check hook
export function useHealthCheck() {
  const [health, setHealth] = useState<{
    status: string;
    uptime: number;
    lastCheck: string;
  } | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setHealth({
          status: data.status,
          uptime: data.uptime_seconds || 0,
          lastCheck: new Date().toISOString()
        });
        return true;
      } else {
        setHealth(null);
        return false;
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth(null);
      return false;
    }
  }, []);

  return {
    health,
    checkHealth,
    isHealthy: health?.status === 'healthy'
  };
}
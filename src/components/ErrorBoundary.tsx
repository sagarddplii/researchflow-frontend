import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console and external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({ errorInfo });

    // Send error to monitoring service (if available)
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Send to backend error tracking
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(console.error);
    } catch (e) {
      console.error('Failed to log error to service:', e);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Comic Book Error UI
      return (
            <div className="error-boundary" style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              color: '#1e293b',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
          <div className="error-container" style={{
            textAlign: 'center',
            maxWidth: '600px',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            borderRadius: '24px'
          }}>
            <div className="error-icon" style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              transform: 'rotate(15deg)'
            }}>⚠</div>
            <h2 className="error-title" style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              color: '#1e293b',
              fontWeight: 'bold'
            }}>Something went wrong</h2>
            <p className="error-message" style={{
              fontSize: '1.2rem',
              marginBottom: '2rem',
              color: 'rgba(30, 41, 59, 0.8)',
              lineHeight: '1.5'
            }}>
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details" style={{
                marginBottom: '2rem',
                textAlign: 'left',
                background: 'rgba(30, 41, 59, 0.05)',
                color: '#1e293b',
                padding: '1rem',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <summary style={{
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  cursor: 'pointer'
                }}>Error Details (Development Only)</summary>
                <pre className="error-stack" style={{
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="error-actions" style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
                  <button
                    onClick={this.handleRetry}
                    className="retry-button"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Try Again
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="reload-button"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#1e293b',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      boxShadow: '0 4px 16px rgba(99, 102, 241, 0.15)',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    }}
                  >
                    Reload Page
                  </button>
            </div>
          </div>
          
          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #000;
              color: #fff;
              font-family: 'Courier New', monospace;
            }
            
            .error-container {
              text-align: center;
              max-width: 600px;
              padding: 2rem;
              border: 1px solid #333;
              background: #111;
              border-radius: 8px;
            }
            
            .error-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            
            .error-title {
              font-size: 1.5rem;
              margin-bottom: 1rem;
              color: #fff;
            }
            
            .error-message {
              font-size: 1rem;
              margin-bottom: 2rem;
              color: #ccc;
              line-height: 1.5;
            }
            
            .error-details {
              margin: 1rem 0;
              text-align: left;
            }
            
            .error-details summary {
              cursor: pointer;
              color: #fff;
              margin-bottom: 0.5rem;
            }
            
            .error-stack {
              background: #222;
              padding: 1rem;
              border-radius: 4px;
              font-size: 0.8rem;
              color: #ff6b6b;
              overflow-x: auto;
              white-space: pre-wrap;
            }
            
            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
            }
            
            .retry-button, .reload-button {
              padding: 0.75rem 1.5rem;
              border: 1px solid #333;
              background: #000;
              color: #fff;
              cursor: pointer;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              transition: all 0.3s ease;
            }
            
            .retry-button:hover, .reload-button:hover {
              background: #333;
              border-color: #555;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React, { useState, useEffect } from 'react';
import { useHealthCheck } from '../hooks/useApi';

interface HealthIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { health, checkHealth, isHealthy } = useHealthCheck();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial health check
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, [checkHealth]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'white';
      case 'warning':
        return 'black';
      case 'critical':
        return 'black';
      default:
        return 'black';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✓';
      case 'warning':
        return '⚠';
      case 'critical':
        return '✗';
      default:
        return '?';
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className={`health-indicator ${className}`}       style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
      <div 
        className="health-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="System Health Status"
        style={{
          backgroundColor: health && isHealthy ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: health && isHealthy ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          padding: '8px 12px',
          borderRadius: '16px',
          cursor: 'pointer',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}
      >
        <span className="status-icon" style={{
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {health ? getStatusIcon(health.status) : '?'}
        </span>
        {showDetails && health && (
          <span className="status-text" style={{
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {health.status.toUpperCase()}
          </span>
        )}
      </div>

      {isVisible && (
            <div className="health-details" style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              padding: '16px',
              minWidth: '250px',
              zIndex: 1000,
              borderRadius: '16px'
            }}>
          <div className="health-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '8px'
          }}>
                <h3 style={{
                  margin: '0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  textShadow: '0 2px 4px rgba(99, 102, 241, 0.1)'
                }}>System Health</h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="close-button"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  ×
                </button>
          </div>
          
          <div className="health-content">
            {health ? (
              <>
                <div className="health-status" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span 
                    className="status-dot"
                    style={{ 
                      backgroundColor: getStatusColor(health.status),
                      width: '12px',
                      height: '12px',
                      border: '2px solid black',
                      borderRadius: '50%'
                    }}
                  ></span>
                      <span className="status-label" style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        Status: {health.status.toUpperCase()}
                      </span>
                </div>
                
                <div className="health-metrics" style={{
                  marginBottom: '12px'
                }}>
                  <div className="metric" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                        <span className="metric-label" style={{fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)'}}>Uptime:</span>
                        <span className="metric-value" style={{fontSize: '12px', fontWeight: 'bold', color: 'white'}}>
                          {formatUptime(health.uptime)}
                        </span>
                  </div>
                  
                  <div className="metric" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                        <span className="metric-label" style={{fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)'}}>Last Check:</span>
                        <span className="metric-value" style={{fontSize: '12px', fontWeight: 'bold', color: 'white'}}>
                          {new Date(health.lastCheck).toLocaleTimeString()}
                        </span>
                  </div>
                </div>
                
                <div className="health-actions">
                  <button 
                    onClick={checkHealth}
                    className="refresh-button"
                    disabled={!isHealthy}
                        style={{
                          backgroundColor: isHealthy ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                          padding: '6px 12px',
                          cursor: isHealthy ? 'pointer' : 'not-allowed',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                  >
                    Refresh
                  </button>
                </div>
              </>
            ) : (
              <div className="health-error" style={{
                textAlign: 'center'
              }}>
                    <span style={{fontSize: '14px', marginBottom: '8px', display: 'block', color: 'white'}}>Unable to check system health</span>
                    <button onClick={checkHealth} className="retry-button" style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      Retry
                    </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .health-indicator {
          position: relative;
          display: inline-block;
        }
        
        .health-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        
        .health-toggle:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .status-icon {
          font-size: 1.2rem;
          animation: pulse 2s infinite;
        }
        
        .status-text {
          font-size: 0.8rem;
          font-weight: bold;
          color: #fff;
        }
        
        .health-details {
          position: absolute;
          top: 100%;
          right: 0;
          background: #111;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 1rem;
          min-width: 250px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        
        .health-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #333;
        }
        
        .health-header h3 {
          margin: 0;
          color: #fff;
          font-size: 1rem;
        }
        
        .close-button {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        
        .health-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .status-label {
          color: #fff;
          font-weight: bold;
        }
        
        .health-metrics {
          margin-bottom: 1rem;
        }
        
        .metric {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .metric-label {
          color: #ccc;
          font-size: 0.9rem;
        }
        
        .metric-value {
          color: #fff;
          font-size: 0.9rem;
          font-family: 'Courier New', monospace;
        }
        
        .health-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .refresh-button, .retry-button {
          padding: 0.5rem 1rem;
          border: 1px solid #333;
          background: #000;
          color: #fff;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }
        
        .refresh-button:hover:not(:disabled), .retry-button:hover {
          background: #333;
          border-color: #555;
        }
        
        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .health-error {
          text-align: center;
          color: #ff6b6b;
        }
        
        .health-error span {
          display: block;
          margin-bottom: 0.5rem;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default HealthIndicator;

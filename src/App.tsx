import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
import HealthIndicator from './components/HealthIndicator';

function App() {
  return (
    <ErrorBoundary>
    <Router>
        <div className="App min-h-screen relative overflow-hidden bg-white" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          background: '#ffffff',
          color: '#1e293b'
        }}>
          {/* Premium Liquid Glass Background */}
          <div className="fixed inset-0 overflow-hidden">
            {/* Subtle elegant orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-5" style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 100%)',
              animation: 'float 8s ease-in-out infinite'
            }}></div>
            <div className="absolute top-40 right-32 w-80 h-80 rounded-full blur-3xl opacity-4" style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 100%)',
              animation: 'float 10s ease-in-out infinite reverse',
              animationDelay: '2s'
            }}></div>
            <div className="absolute bottom-32 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-3" style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.04) 50%, transparent 100%)',
              animation: 'float 12s ease-in-out infinite',
              animationDelay: '4s'
            }}></div>
            <div className="absolute bottom-20 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-6" style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 100%)',
              animation: 'float 9s ease-in-out infinite reverse',
              animationDelay: '1s'
            }}></div>
            
            {/* Subtle floating particles */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full" style={{
              background: 'rgba(99, 102, 241, 0.15)',
              animation: 'sparkle 4s ease-in-out infinite',
              animationDelay: '0.5s',
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.1)'
            }}></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full" style={{
              background: 'rgba(236, 72, 153, 0.2)',
              animation: 'sparkle 3s ease-in-out infinite',
              animationDelay: '1.5s',
              boxShadow: '0 0 8px rgba(236, 72, 153, 0.15)'
            }}></div>
            <div className="absolute bottom-1/3 left-1/5 w-3 h-3 rounded-full" style={{
              background: 'rgba(168, 85, 247, 0.12)',
              animation: 'sparkle 5s ease-in-out infinite',
              animationDelay: '2.5s',
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.1)'
            }}></div>
            
            {/* Very subtle glass texture overlay */}
            <div className="absolute inset-0 opacity-1" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.03) 1px, transparent 1px),
                radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px, 60px 60px, 100px 100px'
            }}></div>
          </div>

          {/* Elegant White Glass Navigation */}
          <nav className="relative z-50 sticky top-0" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {/* Elegant White Glass Logo */}
                    <div 
                      className="w-14 h-14 text-white flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-300 group" 
                      onClick={() => window.location.href = '/'}
                      style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <span className="font-bold text-xl group-hover:scale-110 transition-transform duration-300" style={{
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}>RF</span>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <h1 className="text-2xl font-bold" style={{
                      background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 50%, #cbd5e1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 8px rgba(99, 102, 241, 0.1)'
                    }}>
                      ResearchFlow
                  </h1>
                    <p className="text-xs font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)',
                      letterSpacing: '0.05em'
                    }}>Paper Generator</p>
                </div>
              </div>
              
                <div className="flex items-center space-x-8">
                  <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="relative group font-medium transition-all duration-300 px-3 py-2 rounded-lg" style={{
                      color: 'rgba(30, 41, 59, 0.8)'
                    }}>
                      <span className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">Features</span>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}></div>
                    </a>
                    <a href="#about" className="relative group font-medium transition-all duration-300 px-3 py-2 rounded-lg" style={{
                      color: 'rgba(30, 41, 59, 0.8)'
                    }}>
                      <span className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">About</span>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}></div>
                    </a>
                    <a href="#contact" className="relative group font-medium transition-all duration-300 px-3 py-2 rounded-lg" style={{
                      color: 'rgba(30, 41, 59, 0.8)'
                    }}>
                      <span className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">Contact</span>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}></div>
                  </a>
                </div>
                
                  <div className="flex items-center space-x-3">
                    <HealthIndicator showDetails={true} />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
            <main className="relative z-10 bg-white min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

          {/* Elegant White Glass Footer */}
          <footer className="relative z-10 mt-20" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderTop: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 -8px 32px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 text-white flex items-center justify-center rounded-2xl transition-all duration-500 group" style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      <span className="font-bold text-2xl group-hover:scale-110 transition-transform duration-300">RF</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{
                        background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 50%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ResearchFlow
                      </h3>
                      <p className="text-sm font-medium" style={{
                        color: 'rgba(30, 41, 59, 0.7)',
                        letterSpacing: '0.05em'
                      }}>Paper Generator</p>
                    </div>
                  </div>
                  <p className="max-w-md leading-relaxed" style={{
                    color: 'rgba(30, 41, 59, 0.7)',
                    lineHeight: '1.6'
                  }}>
                  Transform your research ideas into publication-ready papers with AI-powered analysis, 
                    automatic citation management, and comprehensive quality assessment. Experience the future of academic writing.
                </p>
              </div>
              
              <div>
                  <h4 className="font-bold mb-6 uppercase" style={{
                    color: 'rgba(30, 41, 59, 0.9)',
                    borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
                    paddingBottom: '8px',
                    letterSpacing: '0.05em'
                  }}>Features</h4>
                  <ul className="space-y-3">
                    <li className="transition-all duration-300 cursor-pointer relative group font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)'
                    }}>
                      <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'rgba(99, 102, 241, 0.6)',
                        boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)'
                      }}></span>
                      <span className="group-hover:text-blue-600 transition-colors duration-300">Smart Search</span>
                    </li>
                    <li className="transition-all duration-300 cursor-pointer relative group font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)'
                    }}>
                      <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'rgba(168, 85, 247, 0.6)',
                        boxShadow: '0 0 8px rgba(168, 85, 247, 0.3)'
                      }}></span>
                      <span className="group-hover:text-purple-600 transition-colors duration-300">AI Analysis</span>
                    </li>
                    <li className="transition-all duration-300 cursor-pointer relative group font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)'
                    }}>
                      <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'rgba(236, 72, 153, 0.6)',
                        boxShadow: '0 0 8px rgba(236, 72, 153, 0.3)'
                      }}></span>
                      <span className="group-hover:text-pink-600 transition-colors duration-300">Paper Generation</span>
                    </li>
                    <li className="transition-all duration-300 cursor-pointer relative group font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)'
                    }}>
                      <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'rgba(6, 182, 212, 0.6)',
                        boxShadow: '0 0 8px rgba(6, 182, 212, 0.3)'
                      }}></span>
                      <span className="group-hover:text-cyan-600 transition-colors duration-300">Citation Management</span>
                    </li>
                </ul>
              </div>
              
              <div>
                  <h4 className="font-bold mb-6 uppercase" style={{
                    color: 'rgba(30, 41, 59, 0.9)',
                    borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
                    paddingBottom: '8px',
                    letterSpacing: '0.05em'
                  }}>Resources</h4>
                  <ul className="space-y-3">
                    <li className="transition-all duration-300 cursor-pointer relative group font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)'
                    }}>
                      <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'rgba(99, 102, 241, 0.6)',
                        boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)'
                      }}></span>
                      <span className="group-hover:text-blue-600 transition-colors duration-300">Documentation</span>
                    </li>
                    <li className="transition-all duration-300 cursor-pointer relative group font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)'
                    }}>
                      <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'rgba(168, 85, 247, 0.6)',
                        boxShadow: '0 0 8px rgba(168, 85, 247, 0.3)'
                      }}></span>
                      <span className="group-hover:text-purple-600 transition-colors duration-300">API Reference</span>
                    </li>
                    <li className="transition-all duration-300 cursor-pointer relative group font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)'
                    }}>
                      <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'rgba(236, 72, 153, 0.6)',
                        boxShadow: '0 0 8px rgba(236, 72, 153, 0.3)'
                      }}></span>
                      <span className="group-hover:text-pink-600 transition-colors duration-300">Support</span>
                    </li>
                    <li className="transition-all duration-300 cursor-pointer relative group font-medium" style={{
                      color: 'rgba(30, 41, 59, 0.7)'
                    }}>
                      <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'rgba(6, 182, 212, 0.6)',
                        boxShadow: '0 0 8px rgba(6, 182, 212, 0.3)'
                      }}></span>
                      <span className="group-hover:text-cyan-600 transition-colors duration-300">Community</span>
                    </li>
                </ul>
              </div>
            </div>
            
              <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center" style={{
                borderTop: '1px solid rgba(99, 102, 241, 0.1)'
              }}>
                <p className="text-sm font-medium" style={{
                  color: 'rgba(30, 41, 59, 0.6)'
                }}>
                  © 2024 ResearchFlow. All rights reserved.
                </p>
                <div className="flex space-x-8 mt-4 sm:mt-0">
                  <a href="#" className="relative group font-medium transition-all duration-300" style={{
                    color: 'rgba(30, 41, 59, 0.7)'
                  }}>
                    <span className="group-hover:text-blue-600 transition-colors duration-300">Privacy Policy</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </a>
                  <a href="#" className="relative group font-medium transition-all duration-300" style={{
                    color: 'rgba(30, 41, 59, 0.7)'
                  }}>
                    <span className="group-hover:text-blue-600 transition-colors duration-300">Terms of Service</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              </div>
            </div>
          </div>
        </footer>

          {/* Elegant Glass Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                color: '#1e293b',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />

              {/* Premium Liquid Glass Animations */}
              <style jsx>{`
                @keyframes float {
                  0%, 100% { 
                    transform: translateY(0px) translateX(0px);
                    opacity: 0.3;
                  }
                  33% { 
                    transform: translateY(-20px) translateX(10px);
                    opacity: 0.4;
                  }
                  66% { 
                    transform: translateY(-10px) translateX(-10px);
                    opacity: 0.2;
                  }
                }

                @keyframes sparkle {
                  0%, 100% { 
                    opacity: 0.3;
                    transform: scale(1);
                  }
                  50% { 
                    opacity: 1;
                    transform: scale(1.2);
                  }
                }

                @keyframes shimmer {
                  0% { 
                    background-position: -200% 0;
                  }
                  100% { 
                    background-position: 200% 0;
                  }
                }

                .glass-shimmer {
                  background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.1) 50%,
                    rgba(255, 255, 255, 0) 100%
                  );
                  background-size: 200% 100%;
                  animation: shimmer 3s infinite;
                }

                .premium-hover {
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .premium-hover:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }
              `}</style>
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;

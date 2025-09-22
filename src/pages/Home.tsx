import React, { useState } from 'react';
import { Search, FileText, BarChart3, BookOpen, Loader2, Sparkles, Brain, TrendingUp, ArrowRight, FileEdit, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SearchBar from '../components/SearchBar';
import SummaryCard from '../components/SummaryCard';
import PaperDraft from '../components/PaperDraft';
import References from '../components/References';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useResearchPipeline } from '../hooks/useApi';

interface SearchFilters {
  maxPapers: number;
  sources: string[];
  dateRange: {
    start: string;
    end: string;
  };
  paperType: string;
}

interface ResearchData {
  topic: string;
  papers: any[];
  summaries: any;
  citations: any;
  draft_paper: any;
  references: any[];
  analytics: any;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  processing_time?: number;
}

const Home: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'search' | 'results' | 'paper' | 'analytics'>('search');
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [activeTab, setActiveTab] = useState<'papers' | 'summaries' | 'draft' | 'references' | 'analytics'>('papers');
  const [citationStyle, setCitationStyle] = useState<'apa' | 'mla' | 'chicago' | 'ieee'>('apa');
  
  // Use robust API hook
  const { 
    data: pipelineResult, 
    loading, 
    error, 
    execute: executePipeline, 
    reset, 
    retry, 
    isRetrying 
  } = useResearchPipeline();

  const handleSearch = async (query: string, filters: SearchFilters) => {
    if (loading) {
      toast.error('Search already in progress. Please wait...');
      return;
    }
    
    setCurrentStep('results');
    reset(); // Clear previous results
    
    // Scroll to top when search starts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      toast.loading('Starting research pipeline...', { id: 'research-start' });
      
      // Use the robust API hook
      const result = await executePipeline('/research-pipeline', {
        method: 'POST',
        body: JSON.stringify({
          query: query,
          max_papers: filters.maxPapers,
          sources: filters.sources,
          paper_length: filters.paperType === 'short' ? 'short' : filters.paperType === 'long' ? 'long' : 'medium',
          citation_style: 'apa',
          timeout_seconds: 60
        })
      });
      
      toast.dismiss('research-start');
      
      if (result.status === 'error') {
        throw new Error(result.error || 'Pipeline execution failed');
      }
      
      // Debug: Log the result to see what we're getting
      console.log('API Result:', result);
      
      // Normalize backend response to frontend shape
      const normalized = {
        topic: result.query || query,
        papers: (result as any).papers || [],
        summaries: (result as any).summaries || {},
        citations: (result as any).citations || {},
        draft_paper: (result as any).draft || (result as any).draft_paper || null,
        references: (result as any).references || (result as any).papers || [],
        analytics: (result as any).analytics || null,
        status: result.status === 'success' ? 'completed' : 'error',
        processing_time: (result as any).supervisor_metrics?.total_time
      } as ResearchData;
      
      console.log('Normalized data:', normalized);
      
      setResearchData(normalized);
      setCurrentStep('results');
      setActiveTab('papers');
      
      // Scroll to top when results are loaded
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      toast.success('Research completed successfully!', { id: 'research-success' });
      
    } catch (err: any) {
      toast.dismiss('research-start');
      
      console.error('Research pipeline failed:', err);
      
      // Handle different types of errors
      if (err.name === 'AbortError') {
        toast.error('Request was interrupted. Please try again.');
        return;
      }
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        toast.error('Cannot connect to backend. Please check if the server is running.');
        return;
      }
      
      // Show error with retry option
      toast.error(
        (t) => (
          <div className="flex items-center gap-2">
            <span>{err.message || 'An unexpected error occurred'}</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleSearch(query, filters);
              }}
              className="px-2 py-1 bg-white text-black rounded text-xs hover:bg-gray-200"
            >
              Retry
            </button>
          </div>
        ),
        { duration: 10000 }
      );
      
      // Fallback: create mock data so the app remains usable without backend
      const now = new Date().toISOString();
      const mockPapers = [
        {
          id: 'p1',
          title: `${query} - A Comprehensive Overview`,
          authors: ['Alice Smith', 'Bob Johnson'],
          abstract: `This paper explores ${query} with a focus on recent advancements and applications.`,
          published_date: '2023-06-01',
          journal: 'Journal of Research',
          url: 'https://example.com/paper1',
          relevance_score: 0.85,
          citations_count: 42,
          year: 2023
        }
      ];
      const mockSummaries = {
        thematic_summary: `Key themes in ${query} include methodology, applications, and future directions.`,
        key_findings: [
          { finding: `Significant progress in ${query} since 2020`, papers: mockPapers, confidence: 0.8 }
        ],
        methodology_summary: { experimental: mockPapers, computational: mockPapers },
        individual_summaries: [
          { paper_id: 'p1', title: mockPapers[0].title, summary: mockPapers[0].abstract, key_points: [], relevance_score: 0.85 }
        ],
        gaps_and_opportunities: ['Need for larger datasets', 'Standardized benchmarks']
      } as any;
      const mockDraft = {
        title: `${query}: A Mock Generated Paper`,
        abstract: `This mock abstract summarizes ${query} and references findings [1].`,
        sections: {
          introduction: `Introduction to ${query}.`,
          literature_review: `A review of ${query} literature.`,
          discussion: `Discussion on ${query}.`,
          conclusion: `Conclusions about ${query}.`
        },
        metadata: { topic: query, word_count: 1200, generation_date: now }
      };
      const mockReferences = [
        {
          id: 'r1',
          title: `${query} Study`,
          authors: ['Alice Smith', 'Bob Johnson'],
          journal: 'Journal of Research',
          year: '2023',
          relevance_score: 0.9,
          citations_count: 42,
          url: 'https://example.com/paper1'
        }
      ];
      const mockAnalytics = {
        paper_metrics: {
          word_count: 1200,
          section_count: 4,
          abstract_length: 25,
          average_section_length: 300,
          readability_score: 0.6,
          citation_density: 12
        },
        content_analysis: {
          keywords: [query.split(' ')[0] || 'topic', 'analysis', 'methodology'],
          topics: ['Applications', 'Trends'],
          sentiment: { positive: 0.6, negative: 0.1, neutral: 0.3 },
          coherence_score: 0.8,
          academic_tone_score: 0.7
        },
        source_analysis: {
          total_sources: 1,
          publication_years: { earliest: 2023, latest: 2023, average: 2023, median: 2023 },
          journal_diversity: 1,
          author_diversity: 2,
          citation_impact: { total_citations: 42, average_citations: 42, median_citations: 42, max_citations: 42 },
          relevance_analysis: { average_relevance: 0.85, median_relevance: 0.85, high_relevance_count: 1 }
        },
        trend_analysis: {
          publication_trends: { year_distribution: { '2023': 1 }, growth_rate: 0.0, recent_activity: 1 },
          methodological_trends: { experimental: 1, computational: 1 },
          topic_trends: { [query.split(' ')[0] || 'topic']: 1 }
        },
        recommendations: ['Increase citation density', 'Add methodology details']
      } as any;

      const normalized = {
        topic: query,
        papers: mockPapers as any[],
        summaries: mockSummaries,
        citations: {},
        draft_paper: mockDraft,
        references: mockReferences as any[],
        analytics: mockAnalytics,
        status: 'completed'
      } as ResearchData;

      setResearchData(normalized);
      setCurrentStep('paper');
    }
  };

  // const handleStepChange = (step: 'search' | 'results' | 'paper' | 'analytics') => {
  //   setCurrentStep(step);
  // };

  const handleReferenceSelect = (_reference: any) => {
    // Selection can be handled as needed
  };

  const handleCitationStyleChange = (style: 'apa' | 'mla' | 'chicago' | 'ieee') => {
    setCitationStyle(style);
    toast.success(`Citation style changed to ${style.toUpperCase()}`);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'search', label: 'Search', icon: <Search className="h-4 w-4" /> },
      { id: 'results', label: 'Analysis', icon: <Brain className="h-4 w-4" /> },
      { id: 'paper', label: 'Generate', icon: <FileText className="h-4 w-4" /> },
      { id: 'analytics', label: 'Insights', icon: <BarChart3 className="h-4 w-4" /> }
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mb-16"
      >
            <div className="relative overflow-hidden p-8 rounded-3xl" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}>
              {/* Premium glass pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-pink-400/40 to-blue-400/40 rounded-full blur-2xl"></div>
              </div>
          
          <div className="relative flex items-center justify-between z-10">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div 
                  className="flex flex-col items-center space-y-3 relative z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                      <motion.div
                        className={`flex items-center justify-center w-14 h-14 transition-all duration-500 rounded-2xl ${
                          currentStep === step.id || (researchData && currentStep !== 'search')
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                        style={{
                          background: currentStep === step.id || (researchData && currentStep !== 'search')
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.7) 50%, rgba(236, 72, 153, 0.6) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
                          backdropFilter: 'blur(15px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          boxShadow: currentStep === step.id || (researchData && currentStep !== 'search')
                            ? '0 8px 32px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                            : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                    {loading && currentStep === step.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      step.icon
                    )}
                  </motion.div>
                      <span className={`text-sm font-medium uppercase transition-colors duration-300 ${
                        currentStep === step.id || (researchData && currentStep !== 'search')
                          ? 'text-gray-800'
                          : 'text-gray-500'
                      }`} style={{
                        textShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
                        letterSpacing: '0.05em'
                      }}>
                        {step.label}
                      </span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-8">
                    <div className={`h-1 w-full transition-all duration-500 rounded-full ${
                      currentStep === step.id || (researchData && currentStep !== 'search')
                        ? ''
                        : ''
                    }`} style={{
                      background: currentStep === step.id || (researchData && currentStep !== 'search')
                        ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.7) 50%, rgba(236, 72, 153, 0.6) 100%)'
                        : 'rgba(99, 102, 241, 0.2)',
                      boxShadow: currentStep === step.id || (researchData && currentStep !== 'search')
                        ? '0 0 20px rgba(99, 102, 241, 0.4)'
                        : 'none'
                    }}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSearchStep = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-16"
    >
      {/* Comic Book Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center"
      >
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 text-white mb-6 rounded-3xl cursor-pointer group transition-all duration-700" style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.7) 50%, rgba(236, 72, 153, 0.6) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles className="h-14 w-14 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" style={{
              filter: 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.6))'
            }} />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(99, 102, 241, 0.4) 100%)',
            animation: 'sparkle 4s ease-in-out infinite',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
          }}></div>
        </div>
        
        <h1 className="text-7xl font-bold mb-6" style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 20px rgba(99, 102, 241, 0.6)',
          letterSpacing: '-0.02em'
        }}>
          ResearchFlow
        </h1>
        <p className="text-sm font-medium mb-8 uppercase tracking-widest" style={{
          color: 'rgba(30, 41, 59, 0.6)',
          letterSpacing: '0.15em'
        }}>
          Premium Paper Generator
        </p>
        <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{
          color: 'rgba(30, 41, 59, 0.8)',
          lineHeight: '1.7'
        }}>
          Generate comprehensive research papers with AI-powered analysis, 
          automatic citation management, and quality assessment. Transform your research ideas into 
          <span className="font-semibold" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}> publication-ready papers</span> in minutes.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SearchBar onSearch={handleSearch} loading={loading} />
      </motion.div>

      {/* Comic Book Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
                <div className="p-6 rounded-2xl" style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 127, 0.8) 100%)',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
                  }}>
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold" style={{
                    color: 'rgba(30, 41, 59, 0.9)'
                  }}>Generation Error</h3>
                  <div className="mt-2" style={{
                    color: 'rgba(30, 41, 59, 0.8)'
                  }}>
                    {error}
                  </div>
                  <div className="flex space-x-3 mt-3">
                    <button
                      onClick={() => reset()}
                      className="text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 127, 0.8) 100%)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => retry()}
                      className="text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comic Book Features */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(99, 102, 241, 0.6)',
            letterSpacing: '-0.01em'
          }}>
            Powerful Features
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{
            color: 'rgba(30, 41, 59, 0.7)',
            lineHeight: '1.6'
          }}>
            Everything you need to transform research ideas into publication-ready papers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="h-8 w-8" />,
              title: "Smart Search",
              description: "Search across multiple academic databases including arXiv, PubMed, and Google Scholar to find the most relevant papers."
            },
            {
              icon: <Brain className="h-8 w-8" />,
              title: "AI-Powered Analysis",
              description: "Advanced AI algorithms analyze papers, extract key findings, and generate comprehensive summaries."
            },
            {
              icon: <FileText className="h-8 w-8" />,
              title: "Paper Generation",
              description: "Generate well-structured research papers with proper citations, methodology, and academic formatting."
            },
            {
              icon: <BarChart3 className="h-8 w-8" />,
              title: "Quality Analytics",
              description: "Comprehensive analytics and quality assessment to ensure your paper meets academic standards."
            },
            {
              icon: <BookOpen className="h-8 w-8" />,
              title: "Citation Management",
              description: "Automatic citation formatting in multiple styles (APA, MLA, Chicago, IEEE) with proper reference management."
            },
            {
              icon: <TrendingUp className="h-8 w-8" />,
              title: "Trend Analysis",
              description: "Analyze research trends, identify gaps, and discover emerging topics in your field of study."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="group relative"
            >
                  <div className="p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-[1.02] group premium-hover" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 text-white group-hover:scale-110 transition-all duration-500 rounded-2xl" style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.7) 50%, rgba(236, 72, 153, 0.6) 100%)',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold transition-colors duration-300" style={{
                    color: 'rgba(30, 41, 59, 0.9)',
                    textShadow: '0 2px 8px rgba(99, 102, 241, 0.1)'
                  }}>
                    {feature.title}
                  </h3>
                </div>
                <p className="leading-relaxed transition-colors duration-300" style={{
                  color: 'rgba(30, 41, 59, 0.7)',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-medium transition-all duration-300 group-hover:translate-x-2" style={{
                  color: 'rgba(99, 102, 241, 0.8)'
                }}>
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderTabbedInterface = () => {
    if (!researchData) return null;

    const tabs = [
      { id: 'papers', label: 'Papers', icon: <FileText className="h-4 w-4" />, count: researchData.papers?.length || 0 },
      { id: 'summaries', label: 'Summaries', icon: <Brain className="h-4 w-4" />, count: Object.keys(researchData.summaries || {}).length },
      { id: 'draft', label: 'Draft', icon: <FileEdit className="h-4 w-4" />, count: researchData.draft_paper ? 1 : 0 },
      { id: 'references', label: 'References', icon: <BookOpen className="h-4 w-4" />, count: researchData.references?.length || 0 },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, count: researchData.analytics ? 1 : 0 }
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
            {/* Elegant Results Header */}
            <div className="text-white p-6 rounded-2xl shadow-xl" style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}>
              <h2 className="text-3xl font-bold mb-4 text-white" style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
                letterSpacing: '-0.02em'
              }}>
                Research Results for '{researchData.topic}'
              </h2>
              <p className="text-sm text-white" style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                opacity: 0.9
              }}>
                {researchData.papers?.length || 0} papers found • {researchData.processing_time ? `${researchData.processing_time}s` : 'Ready'} processing time
              </p>
            </div>

            {/* Elegant Tab Navigation */}
            <div className="p-2 rounded-2xl shadow-lg" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 transition-all duration-300 rounded-xl font-medium ${
                    activeTab === tab.id 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  style={{
                    background: activeTab === tab.id 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: activeTab === tab.id 
                      ? '1px solid rgba(255, 255, 255, 0.3)'
                      : '1px solid rgba(99, 102, 241, 0.1)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                {tab.icon}
                <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="px-2 py-1 text-xs rounded-full shadow-sm" style={{
                      background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                      color: activeTab === tab.id ? 'white' : '#1e293b'
                    }}>
                      {tab.count}
                    </span>
                  )}
              </motion.button>
            ))}
          </div>
        </div>

            {/* Elegant Tab Content */}
            <div className="min-h-[600px] rounded-2xl shadow-xl" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}>
          {activeTab === 'papers' && renderPapersTab()}
          {activeTab === 'summaries' && renderSummariesTab()}
          {activeTab === 'draft' && renderDraftTab()}
          {activeTab === 'references' && renderReferencesTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </motion.div>
    );
  };

  const renderPapersTab = () => {
    if (!researchData?.papers) return null;

    return (
      <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-4" style={{
              color: 'rgba(30, 41, 59, 0.9)'
            }}>Retrieved Papers</h3>
        <div className="grid gap-4">
          {researchData.papers.map((paper, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(15px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold line-clamp-2 text-gray-800">{paper.title}</h4>
                <span className="text-xs px-2 py-1 ml-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm">
                  {paper.source}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm mb-3 text-gray-600">
                <span>{paper.authors?.join(', ') || 'Unknown authors'}</span>
                <span>•</span>
                <span>{paper.year}</span>
                <span>•</span>
                <span>{paper.citation_count} citations</span>
                <span>•</span>
                <span>Relevance: {(paper.relevance_score * 100).toFixed(1)}%</span>
              </div>
              
              <p className="text-sm leading-relaxed mb-4 line-clamp-3 text-gray-700">
                {paper.abstract || 'No abstract available'}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {paper.doi && (
                    <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer"
                       className="text-sm font-medium px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md">
                      View DOI
                    </a>
                  )}
                  {paper.url && (
                    <a href={paper.url} target="_blank" rel="noopener noreferrer"
                       className="text-sm font-medium px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md">
                      View Paper
                    </a>
                  )}
                </div>
                <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">#{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderSummariesTab = () => {
    if (!researchData?.summaries) return null;

    return (
      <div className="p-6 space-y-6">
        <h3 className="text-2xl font-bold mb-6" style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 20px rgba(99, 102, 241, 0.6)',
          letterSpacing: '-0.02em'
        }}>Research Summaries</h3>
        {Object.entries(researchData.summaries).map(([key, summary]: [string, any]) => (
          <SummaryCard
            key={key}
            summary={{
              type: key as any,
              title: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              content: summary,
              metadata: {
                paper_count: researchData.papers?.length || 0,
                average_relevance: researchData.papers?.reduce((acc: number, p: any) => acc + (p.relevance_score || 0), 0) / (researchData.papers?.length || 1) || 0
              }
            }}
            onPaperSelect={handleReferenceSelect}
          />
        ))}
      </div>
    );
  };

  const renderDraftTab = () => {
    if (!researchData?.draft_paper) return null;

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2" style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(99, 102, 241, 0.6)',
            letterSpacing: '-0.02em'
          }}>Generated Paper Draft</h3>
          <p className="text-sm text-gray-600 flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              🔗 Clickable Links
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              📄 DOI Links
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              📚 Citations
            </span>
          </p>
        </div>
        <PaperDraft 
          paper={researchData.draft_paper}
          references={researchData.references}
          editable={true}
        />
      </div>
    );
  };

  const renderReferencesTab = () => {
    if (!researchData?.references || researchData.references.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No References Available</h3>
            <p className="text-gray-600">
              References will appear here once papers are analyzed.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold mb-6" style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 20px rgba(99, 102, 241, 0.6)',
          letterSpacing: '-0.02em'
        }}>References & Citations</h3>
        <References
          references={researchData.references}
          citationStyle={citationStyle}
          onStyleChange={handleCitationStyleChange}
          onReferenceSelect={handleReferenceSelect}
          researchData={researchData}
        />
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    if (!researchData?.analytics) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold mb-6" style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 20px rgba(99, 102, 241, 0.6)',
          letterSpacing: '-0.02em'
        }}>Research Analytics</h3>
        <AnalyticsDashboard 
          analytics={researchData.analytics}
          papers={researchData.papers}
        />
      </div>
    );
  };

  const renderPaperStep = () => {
    if (!researchData?.draft_paper) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Generated Paper
            </h2>
            <p className="text-gray-600 mt-2">Your AI-generated research paper is ready</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setCurrentStep('analytics')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>View Analytics</span>
              </div>
            </motion.button>
            <motion.button
              onClick={() => setCurrentStep('results')}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Back to Analysis</span>
              </div>
            </motion.button>
          </div>
        </div>

        {renderTabbedInterface()}
      </motion.div>
    );
  };

  const renderAnalyticsStep = () => {
    if (!researchData?.analytics) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
            <p className="text-gray-600 mb-4">
              Analytics data is not available for this research session.
            </p>
            <button
              onClick={() => setCurrentStep('paper')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Paper
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 mt-2">Comprehensive insights into your research</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setCurrentStep('paper')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Back to Paper</span>
              </div>
            </motion.button>
          </div>
        </div>

        <AnalyticsDashboard analytics={researchData.analytics} />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      <div className="container mx-auto px-4 py-12">
        {renderStepIndicator()}
        
        <AnimatePresence mode="wait">
          {currentStep === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              {renderSearchStep()}
            </motion.div>
          )}
          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              {renderTabbedInterface()}
            </motion.div>
          )}
          {currentStep === 'paper' && (
            <motion.div
              key="paper"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              {renderPaperStep()}
            </motion.div>
          )}
          {currentStep === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              {renderAnalyticsStep()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;

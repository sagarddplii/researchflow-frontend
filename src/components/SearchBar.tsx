import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Settings, 
  Sparkles, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Check,
  // X
} from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  loading?: boolean;
}

interface SearchFilters {
  maxPapers: number;
  sources: string[];
  dateRange: {
    start: string;
    end: string;
  };
  paperType: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    maxPapers: 50,
    sources: ['semantic_scholar', 'pubmed'],
    dateRange: {
      start: '',
      end: ''
    },
    paperType: 'research_paper'
  });

  const popularTopics = [
    'Machine Learning in Healthcare',
    'Climate Change Research',
    'Artificial Intelligence Ethics',
    'Quantum Computing Applications',
    'Sustainable Energy Solutions',
    'Blockchain Technology',
    'Neural Networks in Medicine',
    'Renewable Energy Systems',
    'Cybersecurity Threats',
    'Data Privacy Protection'
  ];

  const filteredSuggestions = popularTopics.filter(topic =>
    topic.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Search submitted:', query, filters);
    if (query.trim()) {
      onSearch(query.trim(), filters);
      setShowSuggestions(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateDateRange = (field: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const toggleSource = (source: string) => {
    setFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestion >= 0) {
        handleSuggestionClick(filteredSuggestions[selectedSuggestion]);
      } else if (query.trim()) {
        handleSubmit(e as any);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  return (
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto"
        >
          {/* Apple Water Drop Search Container */}
          <div className="relative">
            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
              whileHover={{ scale: 1.01 }}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
          {/* Water Drop Effect Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-pink-200/20 to-blue-200/20 rounded-full blur-xl"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="relative p-8 space-y-6">
            {/* Apple Water Drop Search Input */}
            <div className="relative">
              <motion.div
                className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10"
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
              >
                <Search className="h-6 w-6 text-gray-400" />
              </motion.div>

              <motion.input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Enter your research topic (e.g., 'Machine Learning in Healthcare')"
                className="block w-full pl-14 pr-20 py-5 text-lg font-medium placeholder-gray-400 text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '20px'
                }}
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
              />
              
              <motion.button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={(e) => {
                  console.log('Button clicked');
                  handleSubmit(e);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`px-6 py-3 text-sm font-medium flex items-center space-x-2 transition-all duration-300 rounded-xl ${
                    loading || !query.trim()
                      ? 'cursor-not-allowed'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                  style={{
                    background: loading || !query.trim() 
                      ? 'rgba(99, 102, 241, 0.3)' 
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                  }}
                  animate={loading ? {
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="h-4 w-4" />
                      </motion.div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.div>
              </motion.button>
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)'
                  }}
                >
                  {filteredSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center space-x-3 ${
                        index === selectedSuggestion ? 'bg-blue-50' : 'hover:bg-gray-50'
                      } ${index === filteredSuggestions.length - 1 ? 'rounded-b-xl' : ''}`}
                      whileHover={{ x: 4 }}
                    >
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-800">{suggestion}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Control Buttons */}
            <div className="flex justify-end">
              <motion.button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(15px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: 'rgba(30, 41, 59, 0.8)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 pt-6 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Max Papers */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-800">
                        Maximum Papers
                      </label>
                      <select
                        value={filters.maxPapers}
                        onChange={(e) => updateFilter('maxPapers', parseInt(e.target.value))}
                        className="w-full px-4 py-3 text-gray-800 transition-all duration-300 focus:outline-none"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(15px)',
                          WebkitBackdropFilter: 'blur(15px)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px'
                        }}
                      >
                        <option value={25} className="bg-white text-gray-900">25 papers</option>
                        <option value={50} className="bg-white text-gray-900">50 papers</option>
                        <option value={100} className="bg-white text-gray-900">100 papers</option>
                        <option value={200} className="bg-white text-gray-900">200 papers</option>
                      </select>
                    </div>

                    {/* Paper Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-800">
                        Paper Type
                      </label>
                      <select
                        value={filters.paperType}
                        onChange={(e) => updateFilter('paperType', e.target.value)}
                        className="w-full px-4 py-3 text-gray-800 transition-all duration-300 focus:outline-none"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(15px)',
                          WebkitBackdropFilter: 'blur(15px)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px'
                        }}
                      >
                        <option value="research_paper" className="bg-white text-gray-900">Research Paper</option>
                        <option value="review_paper" className="bg-white text-gray-900">Review Paper</option>
                        <option value="methodology_paper" className="bg-white text-gray-900">Methodology Paper</option>
                      </select>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">
                      Publication Date Range
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => updateDateRange('start', e.target.value)}
                        className="w-full px-4 py-3 text-gray-800 transition-all duration-300 focus:outline-none"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(15px)',
                          WebkitBackdropFilter: 'blur(15px)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px'
                        }}
                        placeholder="Start date"
                      />
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => updateDateRange('end', e.target.value)}
                        className="w-full px-4 py-3 text-gray-800 transition-all duration-300 focus:outline-none"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(15px)',
                          WebkitBackdropFilter: 'blur(15px)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px'
                        }}
                        placeholder="End date"
                      />
                    </div>
                  </div>

                  {/* Sources */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">
                      Data Sources
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'semantic_scholar', name: 'Semantic Scholar' },
                        { id: 'pubmed', name: 'PubMed' },
                        { id: 'openalex', name: 'OpenAlex' },
                        { id: 'crossref', name: 'CrossRef' },
                        { id: 'arxiv', name: 'arXiv' }
                      ].map((source) => (
                        <motion.button
                          key={source.id}
                          type="button"
                          onClick={() => toggleSource(source.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                            filters.sources.includes(source.id)
                              ? 'shadow-lg border border-transparent'
                              : 'hover:bg-white/5'
                          }`}
                          style={{
                            background: filters.sources.includes(source.id) 
                              ? 'rgba(255, 255, 255, 0.25)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            border: filters.sources.includes(source.id) 
                              ? '1px solid rgba(99, 102, 241, 0.4)' 
                              : '1px solid rgba(99, 102, 241, 0.2)',
                            color: 'rgba(30, 41, 59, 0.8)'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {filters.sources.includes(source.id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                          )}
                          <span>{source.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>

      {/* Popular Topics */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <p className="text-sm font-semibold mb-4 flex items-center space-x-2" style={{
          color: 'rgba(30, 41, 59, 0.8)'
        }}>
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span>Popular Research Topics</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {popularTopics.slice(0, 6).map((suggestion, index) => (
            <motion.button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: 'rgba(30, 41, 59, 0.8)'
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchBar;

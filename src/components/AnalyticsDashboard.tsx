import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Users, 
  Calendar, 
  Award,
  Target,
  // Activity,
  PieChart,
  LineChart,
  Sparkles,
  Star,
  // Zap,
  Brain,
  // Eye,
  // EyeOff,
  // ChevronDown,
  // ChevronUp,
  // Download,
  // Share2,
  // RefreshCw,
  // Settings
} from 'lucide-react';

interface AnalyticsData {
  paper_metrics: {
    word_count: number;
    section_count: number;
    abstract_length: number;
    average_section_length: number;
    readability_score: number;
    citation_density: number;
  };
  content_analysis: {
    keywords: string[];
    topics: string[];
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
    coherence_score: number;
    academic_tone_score: number;
  };
  source_analysis: {
    total_sources: number;
    publication_years: {
      earliest: number;
      latest: number;
      average: number;
      median: number;
    };
    journal_diversity: number;
    author_diversity: number;
    citation_impact: {
      total_citations: number;
      average_citations: number;
      median_citations: number;
      max_citations: number;
    };
    relevance_analysis: {
      average_relevance: number;
      median_relevance: number;
      high_relevance_count: number;
    };
  };
  quality_indicators: {
    content_completeness: number;
    logical_flow: number;
    evidence_strength: number;
    academic_rigor: number;
    citation_quality: number;
    overall_quality_score: number;
  };
  trend_analysis: {
    publication_trends: {
      year_distribution: Record<string, number>;
      growth_rate: number;
      recent_activity: number;
    };
    methodological_trends: Record<string, number>;
    topic_trends: Record<string, number>;
  };
  recommendations: string[];
}

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
  loading?: boolean;
  papers?: any[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics, loading = false, papers = [] }) => {
  // Ensure analytics has default structure to prevent undefined errors
  const safeAnalytics = {
    paper_metrics: {
      word_count: 2500,
      section_count: 8,
      citation_density: 12,
      readability_score: 0.7,
      abstract_length: 250,
      average_section_length: 300,
      ...analytics?.paper_metrics
    },
    content_analysis: {
      keywords: ['research', 'analysis', 'methodology', 'findings', 'conclusions'],
      sentiment: { positive: 0.6, neutral: 0.3, negative: 0.1 },
      topics: ['Research Methods', 'Data Analysis'],
      ...analytics?.content_analysis
    },
    source_analysis: {
      total_sources: 7,
      journal_diversity: 5,
      ...analytics?.source_analysis
    },
    quality_indicators: {
      overall_quality_score: 0.75,
      content_completeness: 0.8,
      logical_flow: 0.7,
      evidence_strength: 0.6,
      academic_rigor: 0.8,
      ...analytics?.quality_indicators
    },
    trend_analysis: {
      publication_trends: { recent_activity: 5 },
      ...analytics?.trend_analysis
    },
    recommendations: analytics?.recommendations || ['Continue with current approach', 'Consider additional sources', 'Expand methodology section']
  };
  const [activeTab, setActiveTab] = useState<'overview' | 'quality' | 'sources' | 'trends'>('overview');

  // Safety check for analytics data
  if (!analytics || typeof analytics !== 'object') {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div 
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
          }}
        >
          <div className="text-gray-400 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Not Available</h3>
          <p className="text-gray-600">
            Analytics data could not be loaded. Please try generating a new paper.
          </p>
        </div>
      </div>
    );
  }

  // const toggleCard = (cardId: string) => {
  //   const newExpanded = new Set(expandedCards);
  //   if (newExpanded.has(cardId)) {
  //     newExpanded.delete(cardId);
  //   } else {
  //     newExpanded.add(cardId);
  //   }
  //   setExpandedCards(newExpanded);
  // };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'teal' | 'indigo';
    trend?: {
      value: number;
      isPositive: boolean;
    };
    metricId?: string;
  }> = ({ title, value, subtitle, icon, color, trend, metricId }) => {
    const colorClasses = {
      blue: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%)',
      green: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.8) 100%)',
      purple: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(147, 51, 234, 0.8) 100%)',
      orange: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.8) 100%)',
      red: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.8) 100%)',
      pink: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.8) 100%)',
      teal: 'linear-gradient(135deg, rgba(20, 184, 166, 0.9) 0%, rgba(13, 148, 136, 0.8) 100%)',
      indigo: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(79, 70, 229, 0.8) 100%)'
    };

    return (
      <motion.div 
        className="relative p-6 rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
        }}
        whileHover={{ 
          y: -3, 
          scale: 1.01,
          transition: { duration: 0.15, ease: "easeOut" }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
            <motion.p 
              className="text-3xl font-bold text-gray-900"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.1 }}
            >
              {value}
            </motion.p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            {trend && (
              <motion.div 
                className={`flex items-center mt-2 text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: trend.isPositive ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                </motion.div>
                <span>{Math.abs(trend.value)}%</span>
              </motion.div>
            )}
          </div>
          <motion.div 
            className="p-4 rounded-xl text-white shadow-lg"
            style={{
              background: colorClasses[color],
              backdropFilter: 'blur(10px)'
            }}
            whileHover={{ 
              rotate: 5, 
              scale: 1.05,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            {icon}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const ProgressBar: React.FC<{
    label: string;
    value: number;
    max?: number;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'teal' | 'indigo';
    animated?: boolean;
  }> = ({ label, value, max = 1, color = 'blue', animated = true }) => {
    const percentage = (value / max) * 100;
    const colorGradients = {
      blue: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%)',
      green: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.8) 100%)',
      purple: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(147, 51, 234, 0.8) 100%)',
      orange: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.8) 100%)',
      red: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.8) 100%)',
      pink: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.8) 100%)',
      teal: 'linear-gradient(135deg, rgba(20, 184, 166, 0.9) 0%, rgba(13, 148, 136, 0.8) 100%)',
      indigo: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(79, 70, 229, 0.8) 100%)'
    };

    return (
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-gray-700">{label}</span>
          <span className="text-gray-500 font-medium">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <motion.div
            className="h-3 rounded-full shadow-sm"
            style={{
              background: colorGradients[color]
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: animated ? `${Math.min(percentage, 100)}%` : `${Math.min(percentage, 100)}%`
            }}
            transition={{ 
              duration: 1.0, 
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        </div>
      </div>
    );
  };

  const PieChart3D: React.FC<{
    data: { label: string; value: number; color: string }[];
    title: string;
  }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <motion.div 
        className="p-6 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const startAngleRad = (startAngle - 90) * (Math.PI / 180);
              const endAngleRad = (endAngle - 90) * (Math.PI / 180);
              
              const x1 = 50 + 35 * Math.cos(startAngleRad);
              const y1 = 50 + 35 * Math.sin(startAngleRad);
              const x2 = 50 + 35 * Math.cos(endAngleRad);
              const y2 = 50 + 35 * Math.sin(endAngleRad);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  className="cursor-pointer"
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <motion.div 
              key={index} 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.1 + 0.5,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                x: 2,
                transition: { duration: 0.1, ease: "easeOut" }
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-semibold text-gray-900 ml-auto">
                {Math.round((item.value / total) * 100)}%
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <StatCard
          title="Word Count"
          value={safeAnalytics.paper_metrics.word_count.toLocaleString()}
          subtitle="Total words in paper"
          icon={<FileText className="h-6 w-6" />}
          color="blue"
          metricId="word-count"
        />
        <StatCard
          title="Sources Used"
          value={safeAnalytics.source_analysis.total_sources || 0}
          subtitle={`${safeAnalytics.source_analysis.journal_diversity || 0} journals`}
          icon={<Users className="h-6 w-6" />}
          color="green"
          metricId="sources"
        />
        <StatCard
          title="Quality Score"
          value={`${Math.round((safeAnalytics.quality_indicators.overall_quality_score || 0) * 100)}%`}
          subtitle="Overall quality assessment"
          icon={<Award className="h-6 w-6" />}
          color="purple"
          metricId="quality"
        />
        <StatCard
          title="Citation Density"
          value={(analytics?.paper_metrics?.citation_density || 0).toFixed(1)}
          subtitle="Citations per 1000 words"
          icon={<Target className="h-6 w-6" />}
          color="orange"
          metricId="citations"
        />
      </motion.div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Analysis Pie Chart */}
        <PieChart3D
          data={[
            { label: 'Positive', value: safeAnalytics.content_analysis.sentiment?.positive || 0.6, color: '#10B981' },
            { label: 'Neutral', value: safeAnalytics.content_analysis.sentiment?.neutral || 0.3, color: '#3B82F6' },
            { label: 'Negative', value: safeAnalytics.content_analysis.sentiment?.negative || 0.1, color: '#EF4444' }
          ]}
          title="Sentiment Analysis"
        />

        {/* Quality Indicators */}
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Quality Indicators</span>
          </h3>
          <div className="space-y-6">
            <ProgressBar
              label="Content Completeness"
              value={safeAnalytics.quality_indicators.content_completeness}
              color="blue"
            />
            <ProgressBar
              label="Logical Flow"
              value={safeAnalytics.quality_indicators.logical_flow}
              color="green"
            />
            <ProgressBar
              label="Evidence Strength"
              value={safeAnalytics.quality_indicators.evidence_strength}
              color="purple"
            />
            <ProgressBar
              label="Academic Rigor"
              value={safeAnalytics.quality_indicators.academic_rigor}
              color="orange"
            />
          </div>
        </motion.div>
      </div>

      {/* Top Keywords */}
      <motion.div 
        className="p-6 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <span>Top Keywords</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {(safeAnalytics.content_analysis.keywords || ['research', 'analysis', 'methodology', 'findings', 'conclusions']).slice(0, 12).map((keyword, index) => (
            <motion.span
              key={index}
              className="px-4 py-2 text-white text-sm font-semibold rounded-full shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
                backdropFilter: 'blur(10px)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.05 + 0.4,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -1,
                transition: { duration: 0.1, ease: "easeOut" }
              }}
            >
              {keyword}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderQuality = () => (
    <div className="space-y-8">
      <motion.div 
        className="p-8 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
          <div 
            className="p-3 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(236, 72, 153, 0.8) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Award className="h-6 w-6 text-white" />
          </div>
          <span>Detailed Quality Assessment</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="text-center">
              <motion.div 
                className="text-6xl font-bold text-gray-900 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {Math.round((safeAnalytics.quality_indicators.overall_quality_score || 0.75) * 100)}%
              </motion.div>
              <div className="text-lg text-gray-600 font-medium">Overall Quality Score</div>
            </div>
            
            <div className="space-y-4">
              <ProgressBar
                label="Content Completeness"
                value={safeAnalytics.quality_indicators.content_completeness}
                color="blue"
              />
              <ProgressBar
                label="Logical Flow"
                value={safeAnalytics.quality_indicators.logical_flow}
                color="green"
              />
              <ProgressBar
                label="Evidence Strength"
                value={safeAnalytics.quality_indicators.evidence_strength}
                color="purple"
              />
              <ProgressBar
                label="Academic Rigor"
                value={safeAnalytics.quality_indicators.academic_rigor}
                color="orange"
              />
              <ProgressBar
                label="Citation Quality"
                value={safeAnalytics.quality_indicators.citation_quality}
                color="red"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 text-lg">Quality Breakdown</h4>
            <div className="space-y-4">
              {[
                { label: 'Content Completeness', value: safeAnalytics.quality_indicators.content_completeness },
                { label: 'Logical Flow', value: safeAnalytics.quality_indicators.logical_flow },
                { label: 'Evidence Strength', value: safeAnalytics.quality_indicators.evidence_strength },
                { label: 'Academic Rigor', value: safeAnalytics.quality_indicators.academic_rigor },
                { label: 'Citation Quality', value: safeAnalytics.quality_indicators.citation_quality }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex justify-between items-center p-3 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.05)'
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="font-bold text-gray-900">
                    {Math.round(item.value * 100)}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      {analytics.recommendations && analytics.recommendations.length > 0 && (
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>Recommendations</span>
          </h3>
          <div className="space-y-4">
            {analytics.recommendations.map((recommendation, index) => (
              <motion.div 
                key={index} 
                className="flex items-start space-x-4 p-4 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.8) 100%)',
                    backdropFilter: 'blur(10px)'
                  }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {index + 1}
                </motion.div>
                <p className="text-gray-700 font-medium leading-relaxed">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderSources = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sources"
          value={safeAnalytics.source_analysis.total_sources}
          subtitle="Research papers analyzed"
          icon={<FileText className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Journal Diversity"
          value={safeAnalytics.source_analysis.journal_diversity}
          subtitle="Unique journals"
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Author Diversity"
          value={safeAnalytics.source_analysis.author_diversity}
          subtitle="Unique authors"
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Total Citations"
          value={safeAnalytics.source_analysis.citation_impact.total_citations.toLocaleString()}
          subtitle="Across all sources"
          icon={<Target className="h-6 w-6" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>Publication Timeline</span>
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Earliest Publication', value: safeAnalytics.source_analysis.publication_years.earliest },
              { label: 'Latest Publication', value: safeAnalytics.source_analysis.publication_years.latest },
              { label: 'Average Year', value: Math.round(safeAnalytics.source_analysis.publication_years.average) },
              { label: 'Recent Activity', value: `${safeAnalytics.trend_analysis.publication_trends.recent_activity} papers (2020+)` }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex justify-between items-center p-3 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-bold text-blue-600">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>Citation Impact</span>
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Average Citations', value: Math.round(safeAnalytics.source_analysis.citation_impact.average_citations) },
              { label: 'Median Citations', value: safeAnalytics.source_analysis.citation_impact.median_citations },
              { label: 'Max Citations', value: safeAnalytics.source_analysis.citation_impact.max_citations },
              { label: 'High Relevance Sources', value: safeAnalytics.source_analysis.relevance_analysis.high_relevance_count }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex justify-between items-center p-3 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(34, 197, 94, 0.1)'
                }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-bold text-green-600">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="p-6 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Target className="h-5 w-5 text-purple-500" />
          <span>Relevance Analysis</span>
        </h3>
        <div className="space-y-6">
          <ProgressBar
            label="Average Relevance"
            value={safeAnalytics.source_analysis.relevance_analysis.average_relevance}
            color="blue"
          />
          <ProgressBar
            label="Median Relevance"
            value={safeAnalytics.source_analysis.relevance_analysis.median_relevance}
            color="green"
          />
          <div 
            className="text-sm text-gray-600 p-4 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(168, 85, 247, 0.1)'
            }}
          >
            <strong>{safeAnalytics.source_analysis.relevance_analysis.high_relevance_count}</strong> out of{' '}
            <strong>{safeAnalytics.source_analysis.total_sources}</strong> sources have high relevance ({'>'}70%)
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-8">
      <motion.div 
        className="p-6 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <LineChart className="h-5 w-5 text-blue-500" />
          <span>Publication Trends</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <motion.div 
              className="flex justify-between items-center p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(99, 102, 241, 0.1)'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-medium text-gray-700">Growth Rate</span>
              <span className={`font-bold text-lg ${safeAnalytics.trend_analysis.publication_trends.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {safeAnalytics.trend_analysis.publication_trends.growth_rate >= 0 ? '+' : ''}
                {(safeAnalytics.trend_analysis.publication_trends.growth_rate * 100).toFixed(1)}%
              </span>
            </motion.div>
            <motion.div 
              className="flex justify-between items-center p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(34, 197, 94, 0.1)'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-medium text-gray-700">Recent Activity (2020+)</span>
              <span className="font-bold text-lg text-green-600">
                {safeAnalytics.trend_analysis.publication_trends.recent_activity} papers
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-orange-500" />
            <span>Methodological Trends</span>
          </h3>
          <div className="space-y-4">
            {Object.entries(safeAnalytics.trend_analysis.methodological_trends).map(([method, count], index) => (
              <motion.div 
                key={method} 
                className="flex justify-between items-center p-3 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(245, 158, 11, 0.1)'
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-medium text-gray-700 capitalize">{method}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="h-3 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.8) 100%)'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / Math.max(...Object.values(safeAnalytics.trend_analysis.methodological_trends))) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.6 }}
                    />
                  </div>
                  <span className="font-bold text-orange-600">{count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            <span>Top Topics</span>
          </h3>
          <div className="space-y-4">
            {Object.entries(safeAnalytics.trend_analysis.topic_trends)
              .slice(0, 5)
              .map(([topic, count], index) => (
              <motion.div 
                key={topic} 
                className="flex justify-between items-center p-3 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(168, 85, 247, 0.1)'
                }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-medium text-gray-700">{topic}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="h-3 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(147, 51, 234, 0.8) 100%)'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / Math.max(...Object.values(safeAnalytics.trend_analysis.topic_trends))) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                    />
                  </div>
                  <span className="font-bold text-purple-600">{count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <motion.div 
          className="animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div 
            className="h-12 rounded-xl w-1/3 mb-8"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }}
          ></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="h-32 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.1)'
                }}
              ></div>
            ))}
          </div>
          <div 
            className="h-96 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }}
          ></div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.7, 
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 120,
            damping: 12
          }}
        >
        <h1 
          className="text-4xl font-bold mb-3"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600">Comprehensive analysis of your research paper generation</p>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <motion.div 
        className="border-b-2 border-gray-200 mb-8"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.7, 
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-5 w-5" /> },
            { id: 'quality', label: 'Quality', icon: <Award className="h-5 w-5" /> },
            { id: 'sources', label: 'Sources', icon: <Users className="h-5 w-5" /> },
            { id: 'trends', label: 'Trends', icon: <TrendingUp className="h-5 w-5" /> }
          ].map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-3 py-3 px-4 border-b-2 font-semibold text-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -2 }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'quality' && renderQuality()}
          {activeTab === 'sources' && renderSources()}
          {activeTab === 'trends' && renderTrends()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalyticsDashboard;

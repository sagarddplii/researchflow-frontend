import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { 
  Download, 
  Edit, 
  Save, 
  Eye, 
  EyeOff, 
  Copy, 
  Share2, 
  Printer,
  ArrowUp,
  ArrowDown,
  FileText,
  // GripVertical,
  Sparkles,
  CheckCircle,
  Clock,
  Hash,
  BookOpen,
  PenTool,
  // RefreshCw,
  Brain,
  FlaskConical,
  TrendingUp,
  ChevronDown,
  Package,
  FileImage
} from 'lucide-react';

interface PaperSection {
  title: string;
  content: string;
  word_count?: number;
}

interface PaperDraftProps {
  paper: {
    title: string;
    abstract: string;
    sections: Record<string, PaperSection>;
    metadata: {
      word_count: number;
      generation_date: string;
      topic: string;
    };
  };
  references?: any[]; // Add references prop
  onEdit?: (section: string, content: string) => void;
  onSave?: () => void;
  onReorder?: (sectionId: string, direction: 'up' | 'down') => void;
  editable?: boolean;
}

const PaperDraft: React.FC<PaperDraftProps> = ({ 
  paper, 
  references = [],
  onEdit, 
  onSave, 
  onReorder, 
  editable = false 
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showWordCount, setShowWordCount] = useState(true);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  // Lock scroll when modal is open and handle escape key
  React.useEffect(() => {
    if (showDownloadModal) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowDownloadModal(false);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDownloadModal]);
  
  // Track edited content
  const [editedPaper, setEditedPaper] = useState(paper);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingAbstract, setEditingAbstract] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempAbstract, setTempAbstract] = useState('');
  
  // Update edited paper when original paper changes
  useEffect(() => {
    setEditedPaper(paper);
  }, [paper]);

  // Function to make citations, URLs, and DOIs clickable
  const makeCitationsClickable = (text: string) => {
    // First, make DOIs clickable
    const doiPattern = /(10\.\d+\/[^\s]+)/g;
    let processedText = text.replace(doiPattern, (doi) => {
      return `<a href="https://doi.org/${doi}" target="_blank" rel="noopener noreferrer" 
                class="text-green-600 hover:text-green-800 font-semibold underline cursor-pointer 
                       bg-green-50 px-2 py-1 rounded-lg border border-green-200 transition-all duration-200 
                       hover:bg-green-100 hover:border-green-300 hover:shadow-md inline-block mx-1"
                title="Click to open DOI: ${doi}">DOI: ${doi}</a>`;
    });

    // Then, make URLs clickable
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    processedText = processedText.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" 
                class="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer 
                       bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 transition-all duration-200 
                       hover:bg-blue-100 hover:border-blue-300 hover:shadow-md inline-block mx-1"
                title="Click to open: ${url}">${url}</a>`;
    });

    // Finally, make citations clickable
    const citationPattern = /\[(\d+(?:,\s*\d+)*)\]/g;
    
    return processedText.replace(citationPattern, (match, numbers) => {
      const citationNumbers = numbers.split(',').map((n: string) => n.trim());
      const links = citationNumbers.map((num: string) => {
        const refIndex = parseInt(num) - 1;
        const reference = references[refIndex];
        
        if (reference && reference.url) {
          return `<a href="${reference.url}" target="_blank" rel="noopener noreferrer" 
                    class="text-purple-600 hover:text-purple-800 font-semibold underline cursor-pointer 
                           bg-purple-50 px-2 py-1 rounded-lg border border-purple-200 transition-all duration-200 
                           hover:bg-purple-100 hover:border-purple-300 hover:shadow-md inline-block mx-1"
                    title="${reference.title || 'Reference ' + num}">[${num}]</a>`;
        } else {
          return `<span class="text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded-lg border border-purple-200 inline-block mx-1">[${num}]</span>`;
        }
      });
      
      return links.join(', ');
    });
  };

  const handleEdit = (sectionKey: string) => {
    const section = paper.sections[sectionKey];
    setEditingSection(sectionKey);
    setEditContent(section?.content || '');
  };

  const handleSave = () => {
    if (editingSection) {
      // Update the edited paper with new content
      setEditedPaper(prev => ({
        ...prev,
        sections: {
          ...prev.sections,
          [editingSection]: {
            ...prev.sections[editingSection],
            content: editContent
          }
        }
      }));
      
      // Call the original onEdit callback if provided
      if (onEdit) {
        onEdit(editingSection, editContent);
      }
    }
    setEditingSection(null);
    setEditContent('');
    if (onSave) {
      onSave();
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditContent('');
  };

  const handleTitleEdit = () => {
    setTempTitle(editedPaper.title);
    setEditingTitle(true);
  };

  const handleTitleSave = () => {
    setEditedPaper(prev => ({
      ...prev,
      title: tempTitle
    }));
    setEditingTitle(false);
    setTempTitle('');
  };

  const handleTitleCancel = () => {
    setEditingTitle(false);
    setTempTitle('');
  };

  const handleAbstractEdit = () => {
    setTempAbstract(editedPaper.abstract);
    setEditingAbstract(true);
  };

  const handleAbstractSave = () => {
    setEditedPaper(prev => ({
      ...prev,
      abstract: tempAbstract
    }));
    setEditingAbstract(false);
    setTempAbstract('');
  };

  const handleAbstractCancel = () => {
    setEditingAbstract(false);
    setTempAbstract('');
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadPaper = async (format: string) => {
    try {
      setDownloading(format);
      setShowDownloadMenu(false);
      
      let content = '';
      let filename = '';
      let mimeType = '';
      
      // Generate content based on format
      switch (format) {
        case 'txt':
          content = generateTextContent();
          filename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
          mimeType = 'text/plain';
          break;
        case 'markdown':
          content = generateMarkdownContent();
          filename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
          mimeType = 'text/markdown';
          break;
        case 'pdf':
          // For PDF, we'll generate HTML that can be printed to PDF
          content = generateHtmlContent();
          filename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
          mimeType = 'text/html';
          break;
        case 'json':
          content = generateJsonContent();
          filename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
          mimeType = 'application/json';
          break;
        case 'bibtex':
          content = generateBibtexContent();
          filename = `${paper.title.replace(/[^a-zA-Z0-9]/g, '_')}.bib`;
          mimeType = 'text/plain';
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
      
      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${format.toUpperCase()} file downloaded successfully!`);
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Download failed: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const generateTextContent = () => {
    const sections = Object.values(paper.sections);
    const referencesText = references.map((ref, index) => {
      const links = [];
      if (ref.doi) links.push(`DOI: https://doi.org/${ref.doi}`);
      if (ref.url) links.push(`URL: ${ref.url}`);
      const linkText = links.length > 0 ? ` (${links.join(', ')})` : '';
      return `${index + 1}. ${ref.title} - ${ref.authors.join(', ')} (${ref.year})${linkText}`;
    }).join('\n');
    
    return `${paper.title}\n` +
           `Generated on: ${new Date().toLocaleDateString()}\n` +
           `Topic: ${paper.metadata.topic}\n` +
           `Word Count: ${paper.metadata.word_count}\n\n` +
           `ABSTRACT\n` +
           `${paper.abstract}\n\n` +
           sections.map(section => 
             `${section.title.toUpperCase()}\n${section.content}\n`
           ).join('\n') +
           `REFERENCES\n` +
           `${referencesText}`;
  };

  const generateMarkdownContent = () => {
    const sections = Object.values(paper.sections);
    const referencesText = references.map((ref, index) => {
      const links = [];
      if (ref.doi) links.push(`[DOI](https://doi.org/${ref.doi})`);
      if (ref.url) links.push(`[Link](${ref.url})`);
      const linkText = links.length > 0 ? ` ${links.join(' | ')}` : '';
      return `${index + 1}. ${ref.title} - ${ref.authors.join(', ')} (${ref.year})${linkText}`;
    }).join('\n');
    
    return `# ${paper.title}\n\n` +
           `**Generated on:** ${new Date().toLocaleDateString()}\n` +
           `**Topic:** ${paper.metadata.topic}\n` +
           `**Word Count:** ${paper.metadata.word_count}\n\n` +
           `## Abstract\n\n${paper.abstract}\n\n` +
           sections.map(section => 
             `## ${section.title}\n\n${section.content}\n`
           ).join('\n') +
           `## References\n\n` +
           `${referencesText}`;
  };

  const generateHtmlContent = () => {
    const sections = Object.values(paper.sections);
    const referencesHtml = references.map((ref, index) => {
      const links = [];
      if (ref.doi) links.push(`<a href="https://doi.org/${ref.doi}" target="_blank">DOI</a>`);
      if (ref.url) links.push(`<a href="${ref.url}" target="_blank">Link</a>`);
      const linkText = links.length > 0 ? ` (${links.join(' | ')})` : '';
      return `<div class="ref">${index + 1}. ${ref.title} - ${ref.authors.join(', ')} (${ref.year})${linkText}</div>`;
    }).join('');
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${paper.title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #333; }
        h2 { color: #666; margin-top: 30px; }
        .meta { color: #888; font-size: 0.9em; margin-bottom: 30px; }
        .references { margin-top: 40px; }
        .ref { margin-bottom: 10px; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <h1>${paper.title}</h1>
    <div class="meta">
        Generated on: ${new Date().toLocaleDateString()}<br>
        Topic: ${paper.metadata.topic}<br>
        Word Count: ${paper.metadata.word_count}
    </div>
    
    <h2>Abstract</h2>
    <p>${paper.abstract}</p>
    
    ${sections.map(section => 
      `<h2>${section.title}</h2><p>${section.content}</p>`
    ).join('')}
    
    <div class="references">
        <h2>References</h2>
        ${referencesHtml}
    </div>
</body>
</html>`;
  };

  const generateJsonContent = () => {
    const data = {
      metadata: {
        title: paper.title,
        topic: paper.metadata.topic,
        word_count: paper.metadata.word_count,
        generated_date: new Date().toISOString(),
        total_references: references.length
      },
      paper: {
        title: paper.title,
        abstract: paper.abstract,
        sections: paper.sections
      },
      references: references.map(ref => ({
        id: ref.id,
        title: ref.title,
        authors: ref.authors,
        journal: ref.journal,
        year: ref.year,
        doi: ref.doi,
        url: ref.url,
        pages: ref.pages,
        volume: ref.volume,
        issue: ref.issue,
        relevance_score: ref.relevance_score,
        citations_count: ref.citations_count
      }))
    };
    
    return JSON.stringify(data, null, 2);
  };

  const generateBibtexContent = () => {
    return references.map(ref => {
      const authors = ref.authors.join(' and ');
      const title = ref.title.replace(/[{}]/g, '\\$&');
      const journal = ref.journal.replace(/[{}]/g, '\\$&');
      
      return `@article{${ref.id.replace(/[^a-zA-Z0-9]/g, '')},\n` +
             `  title={${title}},\n` +
             `  author={${authors}},\n` +
             `  journal={${journal}},\n` +
             `  year={${ref.year}},\n` +
             `  volume={${ref.volume || ''}},\n` +
             `  number={${ref.issue || ''}},\n` +
             `  pages={${ref.pages || ''}},\n` +
             `  doi={${ref.doi || ''}},\n` +
             `  url={${ref.url || ''}}\n` +
             `}`;
    }).join('\n\n');
  };

  const printPaper = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSectionIcon = (sectionKey: string) => {
    const icons: Record<string, React.ReactNode> = {
      'abstract': <FileText className="h-5 w-5" />,
      'introduction': <BookOpen className="h-5 w-5" />,
      'literature_review': <Brain className="h-5 w-5" />,
      'methodology': <FlaskConical className="h-5 w-5" />,
      'results': <TrendingUp className="h-5 w-5" />,
      'discussion': <Sparkles className="h-5 w-5" />,
      'conclusion': <CheckCircle className="h-5 w-5" />,
      'references': <PenTool className="h-5 w-5" />
    };
    return icons[sectionKey] || <FileText className="h-5 w-5" />;
  };

  const getSectionColor = (sectionKey: string) => {
    const colors: Record<string, string> = {
      'abstract': 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%)',
      'introduction': 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%)',
      'literature_review': 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(147, 51, 234, 0.8) 100%)',
      'methodology': 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.8) 100%)',
      'results': 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.8) 100%)',
      'discussion': 'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.8) 100%)',
      'conclusion': 'linear-gradient(135deg, rgba(20, 184, 166, 0.9) 0%, rgba(13, 148, 136, 0.8) 100%)',
      'references': 'linear-gradient(135deg, rgba(107, 114, 128, 0.9) 0%, rgba(75, 85, 99, 0.8) 100%)'
    };
    return colors[sectionKey] || 'linear-gradient(135deg, rgba(107, 114, 128, 0.9) 0%, rgba(75, 85, 99, 0.8) 100%)';
  };

  const getSectionBg = (sectionKey: string) => {
    return {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(99, 102, 241, 0.1)',
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
    };
  };

  const getDefaultSectionContent = (sectionKey: string) => {
    const defaultContents: Record<string, string> = {
      'introduction': `This study investigates the fundamental aspects of the research topic, building upon previous work [1, 2] and establishing the theoretical framework [3]. The research gap identified in recent literature [4, 5] motivates this investigation. Previous studies have shown significant findings [6, 7] that inform our methodology.

The objectives of this research are threefold: (1) to analyze existing approaches [8, 9], (2) to develop novel methodologies [10], and (3) to validate findings through comprehensive testing [11, 12]. This work contributes to the field by addressing limitations identified in recent studies [13, 14].`,

      'methodology': `The research methodology follows established protocols [15, 16] while incorporating innovative approaches [17]. Data collection procedures were designed based on best practices [18, 19] and ethical guidelines [20].

Experimental Design:
- Sample selection criteria based on [21, 22]
- Data acquisition methods following [23, 24]
- Analysis techniques adapted from [25, 26]

Statistical methods employed include those described in [27, 28], with validation procedures from [29, 30]. The experimental setup ensures reproducibility as outlined in [31, 32].`,

      'results': `The experimental results demonstrate significant findings across multiple metrics. Performance improvements of 15-20% were observed compared to baseline methods [33, 34].

Key Findings:
- Primary outcome measures showed consistent improvements [35, 36]
- Secondary metrics aligned with theoretical predictions [37, 38]
- Statistical significance confirmed through rigorous testing [39, 40]

Comparative analysis with existing approaches [41, 42] reveals substantial advantages in efficiency and accuracy. The results validate the hypotheses proposed in [43, 44] and extend previous findings [45, 46].`,

      'discussion': `The findings contribute significantly to the current understanding of the research domain. The results align with theoretical frameworks [47, 48] while revealing novel insights [49, 50].

Implications:
- Theoretical contributions extend existing models [51, 52]
- Practical applications demonstrate real-world viability [53, 54]
- Methodological advances enable future research [55, 56]

Limitations of this study include those identified in [57, 58], which will be addressed in future work. The findings support the conclusions drawn in [59, 60] while providing new perspectives on [61, 62].`,

      'conclusion': `This research successfully addresses the identified research questions through comprehensive investigation. The findings contribute to the field by advancing theoretical understanding [63, 64] and providing practical solutions [65, 66].

Summary of Contributions:
- Novel methodology development [67, 68]
- Empirical validation of theoretical models [69, 70]
- Practical implementation guidelines [71, 72]

Future research directions include extensions proposed in [73, 74] and applications suggested in [75, 76]. The work establishes a foundation for continued investigation [77, 78] in this important research area.`
    };

    return defaultContents[sectionKey] || `This section will contain detailed content with proper academic citations [1, 2, 3] that will be automatically converted to clickable links when the research paper is generated. The content will follow standard academic formatting and include references to relevant literature [4, 5, 6].`;
  };

  const getDefaultAbstractContent = () => {
    return `This study investigates the fundamental aspects of the research topic through comprehensive analysis and innovative methodology. Building upon previous research [1, 2], we present novel findings that advance the current understanding of the field [3, 4]. Our methodology [5, 6] demonstrates significant improvements over existing approaches [7, 8], with results contributing to both theoretical understanding [9, 10] and practical applications [11, 12]. The findings establish a foundation for future research [13, 14] and provide valuable insights for practitioners [15, 16].`;
  };

  const sectionsArray = Object.entries(paper.sections);

  return (
    <motion.div 
      className="max-w-5xl mx-auto rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Paper Header */}
      <div 
        className="relative text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 50%, rgba(236, 72, 153, 0.7) 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Animated background */}
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(236, 72, 153, 0.1) 100%)'
          }}
        ></div>
        
        <div className="relative p-8">
          <div className="flex justify-between items-start mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              {editingTitle ? (
                <div className="mb-3">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="text-3xl font-bold bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
                    placeholder="Enter paper title..."
                    autoFocus
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={handleTitleSave}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleTitleCancel}
                      className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <h1 
                  className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={editable ? handleTitleEdit : undefined}
                  title={editable ? "Click to edit title" : undefined}
                >
                  {editedPaper.title}
                  {editable && <Edit className="inline-block ml-2 h-5 w-5 text-white/70" />}
                </h1>
              )}
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Generated on {formatDate(paper.metadata.generation_date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">Topic: {paper.metadata.topic}</span>
                </div>
                {showWordCount && (
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">{paper.metadata.word_count.toLocaleString()} words</span>
                  </div>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => setShowWordCount(!showWordCount)}
                className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 border border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showWordCount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </motion.button>
              
              <motion.button
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 border border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {viewMode === 'edit' ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                <span className="font-medium">{viewMode === 'edit' ? 'Preview' : 'Edit'}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Download Button */}
            <motion.button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span className="font-medium">Download</span>
            </motion.button>
            
            <motion.button
              onClick={printPaper}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Printer className="h-4 w-4" />
              <span className="font-medium">Print</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Research Paper',
                    text: 'Check out this research paper generated by ResearchFlow',
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="h-4 w-4" />
              <span className="font-medium">Share</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Paper Content */}
      <div ref={paperRef} className="p-8 space-y-8">
        {/* Abstract */}
        {paper.abstract && (
          <motion.div 
            className="border-l-4 pl-6 rounded-r-2xl p-6"
            style={{
              borderLeftColor: 'rgba(99, 102, 241, 0.3)',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-lg text-white"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {getSectionIcon('abstract')}
                </div>
                <h2 className="text-xl font-bold text-gray-900">Abstract</h2>
              </div>
              
              {editable && (
                <div className="flex items-center space-x-2">
                  {editingSection === 'abstract' ? (
                    <>
                      <motion.button
                        onClick={handleSave}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Save className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ×
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => handleEdit('abstract')}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => copyToClipboard(paper.abstract, 'abstract')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {editingSection === 'abstract' ? (
                <motion.textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  rows={6}
                  placeholder="Enter abstract...\n\nProfessional research abstract format:\nThis study investigates [topic] through comprehensive analysis of [methodology]. Building upon previous research [1, 2], we present novel findings that advance the field [3, 4]. Our methodology [5, 6] demonstrates significant improvements over existing approaches [7, 8]. The results contribute to theoretical understanding [9, 10] and provide practical implications [11, 12].\n\nCitations will be automatically converted to clickable links when the paper is generated."
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.div 
                  className="prose max-w-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p 
                    className="text-gray-700 leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{
                      __html: makeCitationsClickable(editedPaper.abstract || getDefaultAbstractContent())
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {copiedSection === 'abstract' && (
              <motion.div 
                className="mt-3 text-sm text-green-600 font-medium flex items-center space-x-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Copied to clipboard</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Paper Sections */}
        {sectionsArray.map(([sectionKey, section], index) => (
          <motion.div 
            key={sectionKey} 
            className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
              hoveredSection === sectionKey ? 'scale-105' : ''
            }`}
            style={{
              ...getSectionBg(sectionKey),
              border: hoveredSection === sectionKey 
                ? '1px solid rgba(99, 102, 241, 0.3)' 
                : '1px solid rgba(99, 102, 241, 0.1)',
              boxShadow: hoveredSection === sectionKey 
                ? '0 20px 40px rgba(99, 102, 241, 0.2)' 
                : '0 8px 32px rgba(99, 102, 241, 0.1)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            onMouseEnter={() => setHoveredSection(sectionKey)}
            onMouseLeave={() => setHoveredSection(null)}
            whileHover={{ y: -5 }}
          >
            {/* Section Header */}
            <div 
              className="relative p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
              }}
            >
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: getSectionColor(sectionKey)
                }}
              ></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="p-3 rounded-xl text-white shadow-lg"
                    style={{
                      background: getSectionColor(sectionKey),
                      backdropFilter: 'blur(10px)'
                    }}
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {getSectionIcon(sectionKey)}
                  </motion.div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-lg font-bold text-gray-500">
                        {index + 1}.
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 capitalize">
                        {section.title}
                      </h3>
                    </div>
                    {section.word_count && showWordCount && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Hash className="h-3 w-3" />
                        <span className="font-medium">{section.word_count} words</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {editable && viewMode === 'edit' && onReorder && (
                    <>
                      <motion.button
                        onClick={() => onReorder(sectionKey, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => onReorder(sectionKey, 'down')}
                        disabled={index === sectionsArray.length - 1}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </motion.button>
                    </>
                  )}
                  
                  {editable && (
                    <div className="flex items-center space-x-2">
                      {editingSection === sectionKey ? (
                        <>
                          <motion.button
                            onClick={handleSave}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Save className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={handleCancel}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ×
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            onClick={() => handleEdit(sectionKey)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => copyToClipboard(section.content, sectionKey)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div 
              className="p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <AnimatePresence mode="wait">
                {editingSection === sectionKey ? (
                  <motion.textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    rows={Math.max(6, Math.ceil(section.content.length / 100))}
                    placeholder={`Enter ${section.title.toLowerCase()} content...\n\nProfessional research paper format:\nThis study builds upon previous research [1, 2] and extends the methodology proposed by Smith et al. [3]. The experimental design follows established protocols [4] while incorporating novel approaches [5]. Recent findings [6, 7] suggest significant improvements in performance metrics.\n\nCitations will be automatically converted to clickable links when the paper is generated.`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : (
                  <motion.div 
                    className="prose max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: makeCitationsClickable(editedPaper.sections[sectionKey]?.content || section.content || getDefaultSectionContent(sectionKey))
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {copiedSection === sectionKey && (
                <motion.div 
                  className="mt-3 text-sm text-green-600 font-medium flex items-center space-x-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Copied to clipboard</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Paper Footer */}
      <motion.div 
        className="px-8 py-6"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(99, 102, 241, 0.1)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Generated by MIT Research Paper Generator</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Last updated: {formatDate(paper.metadata.generation_date)}</span>
          </div>
        </div>
      </motion.div>

      {/* Download Modal */}
      {showDownloadModal && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 99999,
              width: '100vw',
              height: '100vh',
              margin: 0,
              padding: 0
            }}
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3 
              }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-md w-full mx-4"
              style={{
                zIndex: 100000,
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div 
                  className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.8) 100%)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Download className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Download Research Paper</h3>
                <p className="text-gray-600">Choose your preferred format</p>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    downloadPaper('txt');
                    setShowDownloadModal(false);
                  }}
                  disabled={downloading === 'txt'}
                  className="w-full flex items-center space-x-4 px-5 py-4 text-left rounded-xl transition-all duration-200 text-gray-800"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="h-6 w-6 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Plain Text</div>
                    <div className="text-sm text-gray-600">Universal format (.txt)</div>
                  </div>
                  {downloading === 'txt' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                </motion.button>

                <motion.button
                  onClick={() => {
                    downloadPaper('markdown');
                    setShowDownloadModal(false);
                  }}
                  disabled={downloading === 'markdown'}
                  className="w-full flex items-center space-x-4 px-5 py-4 text-left rounded-xl transition-all duration-200 text-gray-800"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Package className="h-6 w-6 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Markdown</div>
                    <div className="text-sm text-gray-600">With clickable links (.md)</div>
                  </div>
                  {downloading === 'markdown' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                </motion.button>

                <motion.button
                  onClick={() => {
                    downloadPaper('pdf');
                    setShowDownloadModal(false);
                  }}
                  disabled={downloading === 'pdf'}
                  className="w-full flex items-center space-x-4 px-5 py-4 text-left rounded-xl transition-all duration-200 text-gray-800"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.1)',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.1)';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileImage className="h-6 w-6 text-red-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">PDF Document</div>
                    <div className="text-sm text-gray-600">Professional format with clickable citations (.pdf)</div>
                  </div>
                  {downloading === 'pdf' && <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />}
                </motion.button>

                <motion.button
                  onClick={() => {
                    downloadPaper('json');
                    setShowDownloadModal(false);
                  }}
                  disabled={downloading === 'json'}
                  className="w-full flex items-center space-x-4 px-5 py-4 text-left rounded-xl transition-all duration-200 text-gray-800"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Brain className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">JSON Data</div>
                    <div className="text-sm text-gray-600">Complete data export (.json)</div>
                  </div>
                  {downloading === 'json' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                </motion.button>

                <motion.button
                  onClick={() => {
                    downloadPaper('bibtex');
                    setShowDownloadModal(false);
                  }}
                  disabled={downloading === 'bibtex'}
                  className="w-full flex items-center space-x-4 px-5 py-4 text-left rounded-xl transition-all duration-200 text-gray-800"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">BibTeX References</div>
                    <div className="text-sm text-gray-600">For LaTeX & reference managers (.bib)</div>
                  </div>
                  {downloading === 'bibtex' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                </motion.button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <motion.button
                  onClick={() => setShowDownloadModal(false)}
                  className="w-full px-4 py-2 text-gray-700 rounded-xl transition-colors"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default PaperDraft;
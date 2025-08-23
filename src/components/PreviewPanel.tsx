import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Edit, ArrowLeft, Monitor, Smartphone, Tablet, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewPanelProps {
  generatedWebsite: string;
  onEdit: () => void;
  onBack: () => void;
  onDownload: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ 
  generatedWebsite, 
  onEdit, 
  onBack, 
  onDownload 
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  const getPreviewDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '600px' };
    }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.button
                className="mr-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={onBack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Website Preview
                </h3>
                <p className="text-gray-400">Review your generated website</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-black/20 rounded-lg p-1">
                <button
                  className={`p-2 rounded transition-all duration-300 ${
                    viewMode === 'desktop' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded transition-all duration-300 ${
                    viewMode === 'tablet' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setViewMode('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded transition-all duration-300 ${
                    viewMode === 'mobile' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Show Code Toggle */}
              <motion.button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  showCode 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                onClick={() => setShowCode(!showCode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code className="w-4 h-4" />
                <span>{showCode ? 'Hide Code' : 'Show Code'}</span>
              </motion.button>

              {/* Action Buttons */}
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center space-x-2"
                onClick={onDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </motion.button>

              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
                onClick={onEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit className="w-4 h-4" />
                <span>Edit with AI</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showCode ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/40 rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Generated HTML Code</span>
                <button
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedWebsite);
                    alert('Code copied to clipboard!');
                  }}
                >
                  Copy Code
                </button>
              </div>
              <div className="max-h-96 overflow-auto">
                <SyntaxHighlighter
                  language="html"
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    background: 'transparent',
                    fontSize: '14px'
                  }}
                >
                  {generatedWebsite}
                </SyntaxHighlighter>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div 
                className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-500 ${
                  viewMode === 'mobile' ? 'mx-auto' : ''
                }`}
                style={getPreviewDimensions()}
              >
                <iframe
                  srcDoc={generatedWebsite}
                  className="w-full h-full border-none"
                  title="Website Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Generated By Ahsan Labs Web Builder.</span>

            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview Mode: {viewMode}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewPanel;
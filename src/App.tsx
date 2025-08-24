import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Zap,
  Eye,
  MessageSquare,
  Globe,
  Settings,
  Bot,
} from 'lucide-react';
import ModelSelector from './components/ModelSelector';
import WebsiteGenerator from './components/WebsiteGenerator';
import PreviewPanel from './components/PreviewPanel';
import ChatInterface from './components/ChatInterface';
import ExampleGallery from './components/ExampleGallery';
import FloatingParticles from './components/FloatingParticles';

function App() {
  const [selectedModel, setSelectedModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [currentStep, setCurrentStep] = useState('setup'); // setup, generate, preview, chat
  const [generatedWebsite, setGeneratedWebsite] = useState('');
  const [websitePrompt, setWebsitePrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const steps = [
    { id: 'setup', label: 'Model Setup', icon: Settings },
    { id: 'generate', label: 'Generate', icon: Zap },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'chat', label: 'Refine', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden relative">
      <FloatingParticles />

      {/* Hero Section */}
      <motion.div
        ref={targetRef}
        className="relative min-h-screen flex flex-col"
        style={{ y, opacity }}
      >
        {/* Header */}
        <header className="mt-11 sm:mt-9 relative z-10 px-4 sm:px-6">
          <motion.div
            className="flex items-center justify-between max-w-7xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
                <div className="absolute -top-0 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Ahsan Labs Website Builder
              </h1>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.button
                className="px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bot className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              Build Websites with
              <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Magic ✨
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-2">
              Select any AI model, describe your vision, and watch as intelligent algorithms craft beautiful, responsive websites in seconds.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 mb-8 sm:mb-12 space-y-6 sm:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex flex-col sm:flex-row items-center">
                  <motion.div
                    className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${isActive
                      ? 'border-cyan-400 bg-cyan-400/20'
                      : isCompleted
                        ? 'border-green-400 bg-green-400/20'
                        : 'border-gray-600 bg-gray-600/20'
                      }`}
                    whileHover={{ scale: 1.1 }}
                    animate={isActive ? {
                      boxShadow: ['0 0 0 0 rgba(34, 211, 238, 0.4)', '0 0 0 20px rgba(34, 211, 238, 0)']
                    } : {}}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  >
                    <StepIcon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
                      }`} />
                  </motion.div>
                  <span className={`mt-2 sm:mt-0 sm:ml-3 text-xs sm:text-sm font-medium ${isActive ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
                    }`}>
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-12 sm:w-16 h-0.5 ml-8 ${isCompleted ? 'bg-green-400' : 'bg-gray-600'
                      }`} />
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Content Panels */}
          <div className="w-full max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl px-2 sm:px-4">
            {currentStep === 'setup' && (
              <ModelSelector
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                apiKey={apiKey}
                setApiKey={setApiKey}
                onNext={() => setCurrentStep('generate')}
              />
            )}

            {currentStep === 'generate' && (
              <WebsiteGenerator
                selectedModel={selectedModel}
                apiKey={apiKey}
                websitePrompt={websitePrompt}
                setWebsitePrompt={setWebsitePrompt}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                onGenerate={(website) => {
                  setGeneratedWebsite(website);
                  setCurrentStep('preview');
                }}
                onBack={() => setCurrentStep('setup')}
              />
            )}

            {currentStep === 'preview' && (
              <PreviewPanel
                generatedWebsite={generatedWebsite}
                onEdit={() => setCurrentStep('chat')}
                onBack={() => setCurrentStep('generate')}
                onDownload={() => {
                  const blob = new Blob([generatedWebsite], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'generated-website.html';
                  a.click();
                }}
              />
            )}

            {currentStep === 'chat' && (
              <ChatInterface
                selectedModel={selectedModel}
                apiKey={apiKey}
                generatedWebsite={generatedWebsite}
                setGeneratedWebsite={setGeneratedWebsite}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                onBack={() => setCurrentStep('preview')}
              />
            )}
          </div>
        </main>
      </motion.div>

      {/* Example Gallery Section */}
      <ExampleGallery />

      {/* Footer */}
      <footer className="relative display-flex z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              <span className="text-gray-400 text-sm sm:text-base">Made By Ahsan Labs</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-6 text-xs sm:text-sm text-gray-400 space-y-2 sm:space-y-0">
              <a href="https://whatsapp.com/channel/0029Vb6cRL43GJOqdGUq4q0Q" className="hover:text-cyan-400 transition-colors" target='blank'>Join Whatsapp Channel</a>
              <a href="https://wa.me/923343926359?text=Assalamualikum%20Ahsan%2C%20I%20Am%20From%20Your%20AI%20Website%20Builder" className="hover:text-cyan-400 transition-colors" target='blank'>Message Owner</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

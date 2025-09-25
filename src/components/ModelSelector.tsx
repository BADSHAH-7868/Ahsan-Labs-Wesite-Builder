import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Key, ChevronDown, Check, Bot, Sparkles } from 'lucide-react';

// Free models from OpenRouter
const FREE_MODELS = [
  { id: 'x-ai/grok-4-fast:free', name: 'Grok-4 Fast', provider: 'x-ai' },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder 480B A35B', provider: 'Qwen' },
  { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', provider: 'MoonshotAI' },
  { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small 3.2 24B Instruct', provider: 'Mistral AI' },
  { id: 'qwen/qwen2.5-72b-instruct:free', name: 'Qwen2.5 72B Instruct', provider: 'Qwen' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct', provider: 'Meta' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B Instruct', provider: 'Meta' },
  { id: 'meta-llama/llama-3.2-1b-instruct:free', name: 'Llama 3.2 1B Instruct', provider: 'Meta' },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B Instruct', provider: 'Meta' },
  { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini 128K Instruct', provider: 'Microsoft' },
  { id: 'microsoft/phi-3-medium-128k-instruct:free', name: 'Phi-3 Medium 128K Instruct', provider: 'Microsoft' },
  { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B IT', provider: 'Google' },
  { id: 'google/gemma-2-27b-it:free', name: 'Gemma 2 27B IT', provider: 'Google' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct', provider: 'Mistral AI' },
  { id: 'mistralai/mistral-nemo:free', name: 'Mistral Nemo', provider: 'Mistral AI' },
  { id: 'huggingface/zephyr-7b-beta:free', name: 'Zephyr 7B Beta', provider: 'Hugging Face' },
  { id: 'openchat/openchat-7b:free', name: 'OpenChat 7B', provider: 'OpenChat' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', provider: 'DeepSeek' },
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek Chat', provider: 'DeepSeek' },
  { id: 'anthropic/claude-3-haiku:free', name: 'Claude 3 Haiku', provider: 'Anthropic' },
  { id: 'google/gemini-flash-1.5:free', name: 'Gemini Flash 1.5', provider: 'Google' },
  { id: 'cohere/command-r:free', name: 'Command R', provider: 'Cohere' },
  { id: 'perplexity/llama-3.1-sonar-small-128k-online:free', name: 'Llama 3.1 Sonar Small 128K Online', provider: 'Perplexity' },
  { id: 'perplexity/llama-3.1-sonar-large-128k-online:free', name: 'Llama 3.1 Sonar Large 128K Online', provider: 'Perplexity' }
];

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  onNext: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  setSelectedModel, 
  apiKey, 
  setApiKey, 
  onNext 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModels = FREE_MODELS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedModelData = FREE_MODELS.find(model => model.id === selectedModel);

  const isFormValid = selectedModel && apiKey.trim().length > 0;

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Bot className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Choose Your AI Model
          </h3>
          <p className="text-gray-400">Select a free model from OpenRouter to power your website generation</p>
        </div>

        <div className="space-y-6">
          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Sparkles className="inline w-4 h-4 mr-2" />
              AI Model
            </label>
            <div className="relative">
              <motion.button
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-4 text-left flex items-center justify-between hover:border-cyan-400/50 transition-all duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  {selectedModelData ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-white">
                          {selectedModelData.provider.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{selectedModelData.name}</div>
                        <div className="text-sm text-gray-400">{selectedModelData.provider}</div>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">Select a model...</span>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {isDropdownOpen && (
                <motion.div 
                  className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-3 border-b border-white/10">
                    <input
                      type="text"
                      placeholder="Search models..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredModels.map((model) => (
                      <motion.button
                        key={model.id}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 transition-all duration-200 flex items-center justify-between group"
                        onClick={() => {
                          setSelectedModel(model.id);
                          setIsDropdownOpen(false);
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-white">
                              {model.provider.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                              {model.name}
                            </div>
                            <div className="text-sm text-gray-400">{model.provider}</div>
                          </div>
                        </div>
                        {selectedModel === model.id && (
                          <Check className="w-5 h-5 text-cyan-400" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Key className="inline w-4 h-4 mr-2" />
              OpenRouter API Key
            </label>
            <motion.input
              type="password"
              placeholder="sk-or-..."
              className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              whileFocus={{ scale: 1.02 }}
            />
            <p className="text-xs text-gray-500 mt-2">
              Get your free API key from <a href="https://openrouter.ai/models?max_price=0" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">OpenRouter.ai</a>
            </p>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-8 flex justify-end">
          <motion.button
            className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              isFormValid
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 shadow-lg hover:shadow-cyan-500/25'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            onClick={onNext}
            disabled={!isFormValid}
            whileHover={isFormValid ? { scale: 1.05 } : {}}
            whileTap={isFormValid ? { scale: 0.95 } : {}}
          >
            <Zap className="w-5 h-5" />
            <span>Start Creating</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelSelector;

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, Loader } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedModel: string;
  apiKey: string;
  generatedWebsite: string;
  setGeneratedWebsite: (website: string) => void;
  chatMessages: Message[];
  setChatMessages: (messages: Message[]) => void;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  selectedModel,
  apiKey,
  generatedWebsite,
  setGeneratedWebsite,
  chatMessages,
  setChatMessages,
  onBack
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    let success = false;

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-Title': 'AI Website Builder Chat'
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: 'system',
                content: 'You are an expert web developer assistant. The user will ask you to modify an existing HTML website. Always respond with the complete updated HTML code (including CSS and JavaScript) that incorporates their requested changes. Return only the HTML code without explanations or markdown formatting.'
              },
              {
                role: 'user',
                content: `Here is the current website code:\n\n${generatedWebsite}\n\nPlease make the following changes: ${inputMessage}\n\nReturn the complete updated HTML code.`
              }
            ],
            max_tokens: 8000,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error('Invalid API key');
        }

        const data = await response.json();
        const assistantResponse =
          data.choices[0]?.message?.content ||
          data.choices[0]?.text ||
          '';

        // Clean HTML
        let cleanHTML = assistantResponse
          .replace(/```html|```/g, '')
          .replace(/^Here.*?:/i, '')
          .trim();

        // Ensure HTML wrapper
        if (cleanHTML && !(cleanHTML.includes('<!DOCTYPE html') || cleanHTML.includes('<html'))) {
          cleanHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${cleanHTML}</body></html>`;
        }

        // Update preview
        if (cleanHTML) {
          setGeneratedWebsite(cleanHTML);
        }

        // Assistant message preview (first few lines of code)
        const previewSnippet = cleanHTML
          ? cleanHTML.split('\n').slice(0, 3).join('\n') + '\n...'
          : '⚠️ The AI response was empty or invalid.';

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: previewSnippet,
          timestamp: new Date()
        };

        // Add "Your task is done" message
        const taskDoneMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: '✅ Your task is done!',
          timestamp: new Date()
        };

        setChatMessages(prev => [...prev, assistantMessage, taskDoneMessage]);
        success = true;
        break;
      } catch (error: any) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === 5) {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: '❌ Error: Invalid API key',
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, errorMessage]);
        }
      }
    }

    setIsProcessing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Chat Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/10">
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
                Chat with AI
              </h3>
              <p className="text-gray-400">Refine and modify your website</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto max-h-96">
          {chatMessages.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">Ask me to modify your website, change colors, add features, or make improvements.</p>
              <div className="mt-4 space-y-2 text-xs text-left bg-black/20 rounded-lg p-4">
                <p className="font-medium text-cyan-400">Try these examples:</p>
                <p>• "Change the color scheme to blue and green"</p>
                <p>• "Add a contact form to the website"</p>
                <p>• "Make the header sticky when scrolling"</p>
                <p>• "Add hover effects to the buttons"</p>
              </div>
            </div>
          )}
          
          <AnimatePresence>
            {chatMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-start space-x-3 mb-4 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-sm xl:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white ml-auto'
                      : 'bg-black/20 text-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Loader className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-black/20 text-gray-200 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Describe the changes you want to make..."
              className="flex-1 bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
            />
            <motion.button
              className={`p-3 rounded-xl transition-all duration-300 ${
                inputMessage.trim() && !isProcessing
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isProcessing}
              whileHover={inputMessage.trim() && !isProcessing ? { scale: 1.05 } : {}}
              whileTap={inputMessage.trim() && !isProcessing ? { scale: 0.95 } : {}}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h4 className="text-lg font-semibold text-white">Live Preview</h4>
          <p className="text-sm text-gray-400">See changes in real-time</p>
        </div>
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '400px' }}>
            <iframe
              srcDoc={generatedWebsite}
              className="w-full h-full border-none"
              title="Live Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, ArrowLeft, Layers, Layout, Palette, Code, User, Briefcase, MessageSquare, Mail } from 'lucide-react';

interface WebsiteGeneratorProps {
  selectedModel: string;
  apiKey: string;
  websitePrompt: string;
  setWebsitePrompt: (prompt: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  onGenerate: (website: string) => void;
  onBack: () => void;
}

const PROMPT_EXAMPLES = [
  {
    title: "3D Pizza Restaurant",
    description: "Modern pizza place with 3D effects and online ordering",
    icon: "🍕",
    prompt: "Create a stunning 3D pizza restaurant website with a hero section featuring a rotating 3D pizza model, parallax scrolling with floating pizza ingredients, menu section with 3D hover effects on pizza cards, online ordering form with smooth animations, restaurant location with interactive map, customer reviews with tilt effects, and contact information. Use warm colors like red and orange with dark theme background, include particle effects, custom cursor with pizza slice icon, and smooth scroll transitions."
  },
  {
    title: "3D Tech Startup",
    description: "Futuristic SaaS landing page with 3D elements",
    icon: "🚀",
    prompt: "Build a futuristic tech startup landing page with 3D parallax effects, featuring a hero section with floating geometric shapes, interactive feature cards with 3D transforms, animated pricing plans with hover effects, testimonials with glass-morphism design, team section with 3D profile cards, and call-to-action buttons with glowing animations. Use a dark theme with blue and purple gradients, particle background effects, and smooth scroll-triggered animations."
  },
  {
    title: "3D Creative Portfolio",
    description: "Interactive portfolio with 3D showcase",
    icon: "🎨",
    prompt: "Design a creative 3D portfolio website with an immersive header featuring floating design elements, project gallery with 3D hover effects and tilt animations, about section with animated skills bars and floating icons, services section with interactive cards, client testimonials with parallax effects, and contact form with modern animations. Use a dark theme with colorful neon accents, particle effects, custom cursor, and smooth transitions between sections."
  },
  {
    title: "3D E-commerce Store",
    description: "Fashion retail with 3D product showcase",
    icon: "🛍️",
    prompt: "Create a luxury fashion e-commerce website with 3D product displays, featuring a stylish header with glass-morphism navigation, hero section with rotating product carousel, category sections with 3D hover effects, product cards with tilt animations, interactive shopping cart with smooth transitions, customer reviews with floating effects, and newsletter signup with modern form animations. Use elegant dark theme with gold accents, particle background, and responsive 3D effects."
  }
];

const WebsiteGenerator: React.FC<WebsiteGeneratorProps> = ({ 
  selectedModel, 
  apiKey, 
  websitePrompt, 
  setWebsitePrompt, 
  isGenerating, 
  setIsGenerating, 
  onGenerate, 
  onBack 
}) => {
  const [selectedSections, setSelectedSections] = useState<string[]>([]); // Optional sections

  const websiteSections = [
    { id: 'hero', label: 'Hero Section', icon: Palette },
    { id: 'sidebar', label: 'Sidebar', icon: Layers },
    { id: 'about', label: 'About Section', icon: User },
    { id: 'services', label: 'Services Section', icon: Briefcase },
    { id: 'testimonials', label: 'Testimonials Section', icon: MessageSquare },
    { id: 'contact', label: 'Contact Section', icon: Mail }
  ];

  const handleGenerate = async () => {
    if (!websitePrompt.trim()) return;

    setIsGenerating(true);

    let success = false;

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        // Always include header, main, footer; add optional sections if selected
        const mandatorySections = ['header', 'main', 'footer'];
        const allSections = [...mandatorySections, ...selectedSections];
        const sectionsPrompt = `Include these sections: ${allSections.join(', ')}. `;

        // Add specific instructions for optional sections
        const sectionInstructions = selectedSections.map(section => {
          switch (section) {
            case 'hero':
              return `Hero: Create a full-width hero section with engaging visuals, smooth parallax scrolling with floating elements, bold headline typography, and a prominent call-to-action button with hover animation.`;
            case 'sidebar':
              return `Sidebar: Include a responsive sidebar with interactive widgets, smooth transitions, and touch-friendly interactions for navigation or additional content.`;
            case 'about':
              return `About: Design an about section with animated skills bars, floating icons, and a brief description with smooth fade-in animations.`;
            case 'services':
              return `Services: Create a services section with interactive cards featuring 3D hover effects and concise descriptions of offerings.`;
            case 'testimonials':
              return `Testimonials: Include a testimonials section with client reviews, glass-morphism design, and parallax effects on review cards.`;
            case 'contact':
              return `Contact: Design a contact section with a modern form, smooth animations, and contact information with icons.`;
            default:
              return '';
          }
        }).filter(instruction => instruction).join(' ');

        const fullPrompt = `${sectionsPrompt}${sectionInstructions} ${websitePrompt}. 

IMPORTANT: Create a complete, modern, responsive HTML website following these specifications:

1. Overall Theme & Style:
   - Dark, elegant professional
   - Color scheme: deep blacks dark blue dark gray and professional
   - Modern, clean typography with optional subtle glow

2. Mandatory Sections:
   - Header: Glass-morphism effect with backdrop blur, smooth hover transitions, and responsive collapsible menu
   - Main Content: Grid layouts with smooth hover scale/tilt, light particle/floating background (subtle), modern cards with shadow and 3D depth
   - Footer: Dark gradient background, social media links with hover glow, contact info with icons, newsletter signup with sleek form

3. Interactive Elements:
   - Hover tilt effects on cards
   - Scroll-triggered fade/slide animations
   - Smooth scrolling transitions
   - Simple loader animation

4. Responsive Design:
   - Fluid typography scaling
   - Flexible grid adapting to all screens
   - Mobile-friendly animations
   - Touch-friendly interactions

5. Technical Requirements:
   - Return only a single HTML file with embedded CSS and JavaScript
   - Use modern best practices, semantic HTML
   - Ensure the design looks sleek and professional across all devices
   - Respect prefers-reduced-motion for accessibility

6. Image Generation:
   const seed = Math.floor(Math.random() * 100000);
   let imageUrl = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(websitePrompt)}?width=800&height=600&seed=\${seed}&model=\${selectedModel}&format=jpeg&nologo=true\`;
   Embed the generated image as a link in the hero or main section if applicable.

- Prioritize:
  • Semantic HTML
  • Responsive layouts with flex/grid
  • Fluid typography scaling
  • Touch-friendly interactions
  • Accessible controls with ARIA and skip links
  • Progressive enhancement with graceful degradation
- Use modern CSS (variables, transitions, transforms) and unobtrusive vanilla JavaScript for interactivity (no external frameworks).
- Ensure good performance, low CPU usage, and smooth behavior on both mobile and desktop.

Return the raw HTML file content as the final response. No Markdown, no explanations, and no extra text.`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-Title': 'AI Website Builder'
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: 'system',
                content: `You are an expert web developer and website planner. Your job is to first analyze the user’s request and then generate a tailored plan and prototype.

Step 1 — Planning:
- Read the user’s request carefully.
- Create a short structured PLAN before coding. The plan must describe:
  • Purpose of the website/tool
  • Required sections and their roles (always include header, main, footer; include hero, sidebar, about, services, testimonials, contact only if specified)
  • Key features and interactions (only what is necessary for this request)
  • Suggested design style and color scheme
  • Technologies or APIs to be used (if any)
- Keep the plan concise, clear, and directly relevant to the request.

Step 2 — Website Generation:
- Based on the plan, generate a single complete HTML file (DOCTYPE, <html>, <head>, <body>) containing embedded CSS and JavaScript only — no external asset downloads, no additional files, and no explanations.
- The design must be sleek, professional, responsive, and dark-themed by default unless the plan suggests otherwise.
- Always include header, main, and footer sections.
- Only include hero, sidebar, about, services, testimonials, and contact sections if explicitly requested by the user.
- Use the provided image URL for embedding visuals in the hero or main section if applicable.

Return the raw HTML file content as the final response. No Markdown, no explanations, and no extra text.`
              },
              {
                role: 'user',
                content: fullPrompt
              }
            ],
            max_tokens: 8000,
            temperature: 0.6
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const generatedHTML = data.choices[0]?.message?.content || '';
        
        // Clean up the response to ensure it's proper HTML
        const cleanHTML = generatedHTML.replace(/```html|```/g, '').trim();
        
        onGenerate(cleanHTML);
        success = true;
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === 5) {
          alert('Error generating website after 5 attempts. Please check your API key and try again.');
        }
      }
    }

    setIsGenerating(false);
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="flex items-center mb-8">
          <motion.button
            className="mr-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            onClick={onBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Describe Your Website
            </h3>
            <p className="text-gray-400">Tell the AI what kind of website you want to create</p>
          </div>
        </div>

        {/* Prompt Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {PROMPT_EXAMPLES.map((example, index) => (
            <motion.button
              key={index}
              className="text-left p-4 bg-black/20 rounded-xl border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-300"
              onClick={() => setWebsitePrompt(example.prompt)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{example.icon}</span>
                <div>
                  <div className="font-medium text-white">{example.title}</div>
                  <div className="text-sm text-gray-400">{example.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Website Sections */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            <Layers className="inline w-4 h-4 mr-2" />
            Additional Website Sections (Optional)
          </label>
          <p className="text-gray-400 text-sm mb-2">Header, Main Content, and Footer are included by default.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {websiteSections.map((section) => {
              const SectionIcon = section.icon;
              const isSelected = selectedSections.includes(section.id);
              
              return (
                <motion.button
                  key={section.id}
                  className={`p-3 rounded-lg border transition-all duration-300 flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                  onClick={() => toggleSection(section.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SectionIcon className="w-4 h-4" />
                  <span className="text-sm">{section.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main Prompt Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            <Wand2 className="inline w-4 h-4 mr-2" />
            Website Description
          </label>
          <motion.textarea
            className="w-full h-32 bg-black/20 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
            placeholder="Describe your website in detail... For example: 'Create a modern pizza restaurant website with online ordering, menu showcase, and contact information. Use warm colors and include customer reviews.'"
            value={websitePrompt}
            onChange={(e) => setWebsitePrompt(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <motion.button
            className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              websitePrompt.trim() && !isGenerating
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleGenerate}
            disabled={!websitePrompt.trim() || isGenerating}
            whileHover={websitePrompt.trim() && !isGenerating ? { scale: 1.05 } : {}}
            whileTap={websitePrompt.trim() && !isGenerating ? { scale: 0.95 } : {}}
          >
            <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate Website'}</span>
          </motion.button>
        </div>

        {isGenerating && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-flex items-center space-x-2 text-cyan-400">
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <p className="text-gray-400 mt-2">The AI is crafting your website...</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WebsiteGenerator;

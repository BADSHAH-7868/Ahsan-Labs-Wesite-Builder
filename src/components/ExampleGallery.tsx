import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Code, Download } from 'lucide-react';

const EXAMPLE_WEBSITES = [
  {
    id: 1,
    title: 'Modern Portfolio',
    description: 'Clean design with dark theme',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Portfolio', 'Dark Theme', 'Responsive']
  },
  {
    id: 2,
    title: 'Restaurant Site',
    description: 'Food photography showcase',
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Restaurant', 'Food', 'Ordering']
  },
  {
    id: 3,
    title: 'Tech Startup',
    description: 'SaaS landing page',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['SaaS', 'Landing Page', 'Tech']
  },
  {
    id: 4,
    title: 'E-commerce Store',
    description: 'Online shopping experience',
    image: 'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['E-commerce', 'Shopping', 'Products']
  },
  {
    id: 5,
    title: 'Creative Agency',
    description: 'Bold and colorful design',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Agency', 'Creative', 'Colorful']
  },
  {
    id: 6,
    title: 'Blog Platform',
    description: 'Content-focused layout',
    image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Blog', 'Content', 'Reading']
  }
];

const ExampleGallery: React.FC = () => {
  return (
    <section className="py-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
            Example Gallery
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get inspired by these AI-generated websites. Each example showcases different styles and features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXAMPLE_WEBSITES.map((example, index) => (
            <motion.div
              key={example.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-all duration-500 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={example.image} 
                  alt={example.title}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="flex space-x-2">


                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{example.title}</h3>
                <p className="text-gray-400 mb-4">{example.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {example.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-xs font-medium text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-400 mb-6">More examples coming soon! Create your own to expand the gallery.</p>

        </motion.div>
      </div>
    </section>
  );
};

export default ExampleGallery;
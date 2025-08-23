import React from 'react';
import { motion } from 'framer-motion';

const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-radial from-purple-500/5 via-cyan-500/5 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
    </div>
  );
};

export default FloatingParticles;
import React from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png'

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="relative w-20 h-20">
        {/* Simple rotating line */}
        <motion.div 
          className="absolute top-0 left-1/2 w-px h-full bg-black origin-bottom"
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity
          }}
        />

        {/* Fading logo text */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity
          }}
        >
          <div className="font-light tracking-widest text-xs">
            {<img src={logo}/>||"FABRICATEE"}
          </div>
        </motion.div>

        {/* Minimal border */}
        <motion.div 
          className="absolute inset-0 border border-black"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
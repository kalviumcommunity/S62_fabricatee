import React from 'react';
import { motion } from 'framer-motion';
import fabricImg from '../assets/fabric.jpg';
import designImg from '../assets/design.jpg';

const Design = () => {
  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 1 , ease: 'easeInOut' } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    drag: { scale: 1.1, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-[90vh] bg-gray-100 flex flex-col justify-center items-center px-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        What would you like to explore?
      </h1>
      <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-3/4">
        {/* Browse Designs Card */}
        <motion.a
          href="/design/designs"
          className="relative flex-1 min-h-[17rem] rounded-lg shadow-lg cursor-pointer group hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          drag
          dragConstraints={{ left: 0, right: 0 }}
        >
          {/* Background and Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${designImg})` }}
          ></div>
          <div className="absolute inset-0 bg-white bg-opacity-30 rounded-lg group-hover:bg-opacity-40 transition-all duration-300"></div>

          <div className="relative flex flex-col items-center justify-center text-white p-6 z-10">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex justify-center items-center text-2xl font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              D
            </div>
            <h2 className="text-lg text-gray-800 font-semibold mt-4 group-hover:text-blue-600 transition-all duration-300">
              Browse Designs
            </h2>
            <p className="text-sm text-gray-700 text-center mt-2 group-hover:text-black">
              Discover unique and creative designs for your clothing needs.
            </p>
          </div>
        </motion.a>

        {/* Browse Fabrics Card */}
        <motion.a
          href="/design/fabrics"
          className="relative flex-1 min-h-[17rem] rounded-lg shadow-lg cursor-pointer group hover:shadow-xl"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          drag
          dragConstraints={{ left: 0, right: 0 }}
        >
          {/* Background and Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${fabricImg})` }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg group-hover:bg-opacity-40 transition-all duration-300"></div>

          <div className="relative flex flex-col items-center justify-center text-white p-6 z-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex justify-center items-center text-2xl font-semibold group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              F
            </div>
            <h2 className="text-lg font-semibold mt-4 transition-all duration-300">
              Browse Fabrics
            </h2>
            <p className="text-sm text-center mt-2 group-hover:text-gray-200">
              Explore premium-quality fabrics tailored to your preferences.
            </p>
          </div>
        </motion.a>
      </div>
    </div>
  );
};

export default Design;

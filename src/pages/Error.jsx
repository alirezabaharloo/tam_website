import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Error() {
  return (
    <div className="mt-8 bg-quinary-tint-600 flex items-center justify-center px-4">
      <div className="max-w-[1300px] w-full bg-quinary-tint-900 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-8 md:p-12">
        <div className="text-center">
          {/* 404 Text */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[120px] md:text-[180px] font-bold text-primary leading-none"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4"
          >
            <h2 className="text-[36px] md:text-[48px] font-semibold text-secondary mb-4">
              Page Not Found
            </h2>
            <p className="text-[20px] text-secondary-tint-500 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/"
              className="inline-block px-8 py-4 bg-primary text-quinary-tint-800 text-[20px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex justify-center gap-4"
          >
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <div className="w-3 h-3 bg-tertiary rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
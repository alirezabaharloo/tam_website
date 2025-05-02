import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Shop() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-tint-500 to-primary flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-tint-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-6">
            We're working on something amazing!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12"
        >
          <p className="text-white/70 text-lg mb-4">
            Get ready for exclusive merchandise and team gear
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-4xl font-bold text-secondary-tint-500 tracking-wider"
          >
            TAMSPORT SHOP
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8"
        >
          <div className="flex justify-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-secondary rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="mt-12 h-2 bg-gradient-to-r from-secondary to-secondary-tint-500 rounded-full max-w-md mx-auto"
        />

        {/* Back to Home Button */}
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 px-8 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 group"
        >
          <span className="text-white text-lg font-medium flex items-center gap-2">
            <motion.span
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              ←
            </motion.span>
            Back to Home
          </span>
        </motion.button>
      </div>
    </div>
  )
}

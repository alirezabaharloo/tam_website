import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Shop() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="container w-[1300px] mx-auto px-4">
        <div className="pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-[48px] font-bold text-primary mb-4">
              Coming Soon
            </h1>
            <p className="text-[24px] text-secondary-tint-500 mb-8">
              We're preparing something special for you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center mb-12"
          >
            <div className="w-[2px] h-32 bg-quaternary"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-[32px] font-medium text-primary mb-6">
              TamSport Shop
            </h2>
            <p className="text-[20px] text-secondary max-w-2xl mx-auto mb-12">
              Our online store is currently under development. We're working hard to bring you the best selection of team merchandise and exclusive items.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex justify-center"
          >
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-primary text-white text-lg font-medium rounded-lg hover:bg-primary-tint-500 transition-colors duration-300"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

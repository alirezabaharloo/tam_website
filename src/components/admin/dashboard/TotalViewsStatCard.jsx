import React from 'react';
import { motion } from 'framer-motion';
import { AdminIcons } from '../../../data/Icons';

const itemVariants = {
  hidden: { y: 120, opacity: 0, scale: 0.6 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 12,
      duration: 0.9,
    },
  },
  hover: {
    scale: 1.03,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      duration: 0.2,
    },
  },
};

const TotalViewsStatCard = ({ totalViews, isSuperuser }) => (
  <motion.div
    initial={{ opacity: 0, y: -200, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 200, scale: 0.96 }}
    whileHover="hover"
    variants={itemVariants}
    className={`bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu ${
      isSuperuser ? 'col-span-1 text-center flex-col items-center justify-center p-2' : ''
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-secondary">بازدید کلی</p>
        <p className="text-2xl font-semibold text-primary">{totalViews || 0}</p>
      </div>
      <div className="p-3 bg-purple-500 bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-purple-500 hover:bg-opacity-30">
        <AdminIcons.TotalViews />
      </div>
    </div>
  </motion.div>
);

export default TotalViewsStatCard;

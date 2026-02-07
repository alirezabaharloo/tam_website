import React from 'react';
import { motion } from 'framer-motion';

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

const DashboardContentStatus = ({ publishedArticles, draftArticles }) => {
  const totalArticles = (publishedArticles || 0) + (draftArticles || 0);
  const publishedPercentage = totalArticles > 0 ? (publishedArticles || 0) / totalArticles : 0;
  const draftPercentage = totalArticles > 0 ? (draftArticles || 0) / totalArticles : 0;

  const publishedChartColor = '#10B981';
  const draftChartColor = '#F59E0B';
  const backgroundChartColor = '#E5E7EB';

  const radius = 40;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const publishedSegmentOffset = circumference * (1 - publishedPercentage);

  const donutDrawAnimation = {
    hidden: { strokeDashoffset: circumference },
    visible: {
      strokeDashoffset: 0,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 10,
        duration: 1.8,
        ease: 'easeInOut',
      },
    },
  };

  const publishedDonutDrawAnimation = {
    hidden: { strokeDashoffset: circumference },
    visible: {
      strokeDashoffset: publishedSegmentOffset,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 10,
        duration: 1.5,
        delay: 0.5,
      },
    },
  };

  const textFadeInScale = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.2,
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] col-span-1"
    >
      <h2 className="text-lg font-semibold text-primary mb-4">وضعیت محتوا</h2>
      <div className="relative h-52 w-full flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={backgroundChartColor}
            strokeWidth={strokeWidth}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />

          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={draftChartColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial="hidden"
            animate="visible"
            variants={donutDrawAnimation}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />

          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={publishedChartColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial="hidden"
            animate="visible"
            variants={publishedDonutDrawAnimation}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />

          <motion.text
            x="50"
            y="45"
            textAnchor="middle"
            className="text-2xl font-bold"
            fill="#4B5563"
            variants={textFadeInScale}
            initial="hidden"
            animate="visible"
          >
            {totalArticles}
          </motion.text>
          <motion.text
            x="50"
            y="65"
            textAnchor="middle"
            className="text-xs"
            fill="#6B7280"
            variants={textFadeInScale}
            initial="hidden"
            animate="visible"
          >
            کل مقالات
          </motion.text>
        </svg>
      </div>
      <div className="flex flex-col gap-3 mt-6 w-full px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full mr-2"
              style={{ backgroundColor: publishedChartColor }}
            ></div>
            <span className="text-base font-medium text-secondary">منتشر شده</span>
          </div>
          <span className="text-base font-semibold text-primary">
            {publishedArticles || 0} ({Math.round(publishedPercentage * 100)}%)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full mr-2"
              style={{ backgroundColor: draftChartColor }}
            ></div>
            <span className="text-base font-medium text-secondary">پیش‌نویس</span>
          </div>
          <span className="text-base font-semibold text-primary">
            {draftArticles || 0} ({Math.round(draftPercentage * 100)}%)
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardContentStatus;

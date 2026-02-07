import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

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

const TopViewedArticles = ({ articles }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={itemVariants}
      className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] col-span-1"
    >
      <h2 className="text-lg font-semibold text-primary mb-4">مقالات پربازدید</h2>
      <div className="flex flex-col gap-4">
        {articles?.length > 0 ? (
          articles.map((article, index) => (
            <motion.div
              key={article.slug}
              variants={itemVariants}
              whileHover={{
                scale: 1.035,
                transition: { type: 'spring', stiffness: 320, damping: 22, mass: 0.9 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { type: 'spring', stiffness: 320, damping: 22, mass: 0.9 },
              }}
              onClick={() => navigate(`/news/${article.slug}`)}
              className="group cursor-pointer relative overflow-hidden rounded-xl bg-quinary-tint-800 shadow-md border border-quinary-tint-700 transition-shadow duration-150 hover:shadow-lg"
              initial={{ opacity: 0, y: 200, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.08 * index }}
            >
              <div className="absolute right-0 top-0 h-full w-1 bg-primary rounded-tr-xl rounded-br-xl transition-all duration-150 group-hover:w-1.5" />
              <div className="flex flex-col gap-1 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    #{index + 1}
                  </span>
                  <FaEye className="text-primary text-sm" />
                  <span className="text-secondary-tint-200 text-xs font-semibold">
                    {article.views} بازدید
                  </span>
                </div>
                <p className="text-secondary font-bold text-base md:text-lg group-hover:text-primary transition-colors duration-200">
                  {article.title}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-secondary text-center">مقاله‌ای یافت نشد.</p>
        )}
      </div>
    </motion.div>
  );
};

export default TopViewedArticles;

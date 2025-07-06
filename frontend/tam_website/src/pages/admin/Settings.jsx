import React from 'react';
import { motion } from 'framer-motion';
import { AdminIcons } from '../../data/Icons';

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">تنظیمات</h1>
      </div>
      
      <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <AdminIcons.Settings />
          <h2 className="text-xl font-semibold text-primary">تنظیمات سیستم</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-quinary-tint-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-primary mb-2">تنظیمات عمومی</h3>
            <p className="text-secondary text-sm">این بخش در حال توسعه است...</p>
          </div>
          
          <div className="bg-quinary-tint-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-primary mb-2">تنظیمات امنیتی</h3>
            <p className="text-secondary text-sm">این بخش در حال توسعه است...</p>
          </div>
          
          <div className="bg-quinary-tint-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-primary mb-2">تنظیمات اعلان‌ها</h3>
            <p className="text-secondary text-sm">این بخش در حال توسعه است...</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings; 
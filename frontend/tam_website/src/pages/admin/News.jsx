import React from 'react';
import { motion } from 'framer-motion';
import AdminNewsTab from '../../components/admin/AdminNewsTab';
import { useNavigate } from 'react-router-dom';

const News = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">مدیریت اخبار</h1>
      </div>
      
      <AdminNewsTab navigate={navigate} />
    </motion.div>
  );
};

export default News; 
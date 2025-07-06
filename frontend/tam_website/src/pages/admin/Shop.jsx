import React from 'react';
import { motion } from 'framer-motion';
import AdminShopTab from '../../components/admin/AdminShopTab';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">مدیریت فروشگاه</h1>
      </div>
      
      <AdminShopTab navigate={navigate} />
    </motion.div>
  );
};

export default Shop; 
import React from 'react';
import { motion } from 'framer-motion';
import AdminShopTab from '../../components/admin/AdminShopTab';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate();

  return (
    <div
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">مدیریت فروشگاه</h1>
      </div>
      
      <AdminShopTab navigate={navigate} />
    </div>
  );
};

export default Shop; 
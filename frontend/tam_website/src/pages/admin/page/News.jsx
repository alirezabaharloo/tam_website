import React from 'react';
import { motion } from 'framer-motion';
import AdminNewsTab from '../../../components/admin/AdminNewsTab';
import { useNavigate } from 'react-router-dom';

const News = () => {
  const navigate = useNavigate();

  return (
    <div
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">مدیریت اخبار</h1>
      </div>
      
      <AdminNewsTab navigate={navigate} />
    </div>
  );
};

export default News; 
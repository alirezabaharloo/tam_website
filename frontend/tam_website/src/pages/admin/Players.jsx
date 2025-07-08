import React from 'react';
import { motion } from 'framer-motion';
import AdminPlayersTab from '../../components/admin/AdminPlayersTab';
import { useNavigate } from 'react-router-dom';

const Players = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">   
        <h1 className="text-3xl font-bold text-primary">مدیریت بازیکن‌ها</h1>
        <button 
          onClick={() => navigate('/admin/player/add')}
          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-bold flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          بازیکن جدید
        </button>
      </div>
      
      <AdminPlayersTab navigate={navigate} />
    </div>
  );
};

export default Players; 
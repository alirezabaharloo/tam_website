import React from 'react';
import { motion } from 'framer-motion';
import AdminUsersTab from '../../../components/admin/AdminUsersTab';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const navigate = useNavigate();

  return (
    <div
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">مدیریت کاربران</h1>
      </div>
      
      <AdminUsersTab navigate={navigate} />
    </div>
  );
};

export default Users; 
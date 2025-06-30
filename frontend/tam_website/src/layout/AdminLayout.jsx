import { Outlet, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import SpinLoader from '../components/UI/SpinLoader';
import domainUrl from '../utils/api';
import PageNotFound from '../pages/PageNotFound';
import useAuthHttp from '../hooks/useAuthHttp';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { isAdminPannelAccess } = useAuth();

  console.log(isAdminPannelAccess);
  

  if (!isAdminPannelAccess) {
    return  <PageNotFound />
  }

  return <Outlet />
};

export default AdminLayout;
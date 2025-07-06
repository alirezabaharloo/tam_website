import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useAuthHttp from '../hooks/useAuthHttp';
import SpinLoader from '../components/UI/SpinLoader';
import PageNotFound from '../pages/PageNotFound';
import { AdminIcons } from '../data/Icons';
import domainUrl from '../utils/api';

const AdminLayout = () => {
  const { isAdminPannelAccess, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // گرفتن اطلاعات کاربر
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError
  } = useAuthHttp(`http://${domainUrl}:8000/api/auth/user/`);

  // تعیین تب‌ها بر اساس سطح دسترسی
  const getTabs = () => {
    if (!userData) return [];
    
    if (userData.is_superuser) {
      return [
        { id: 'dashboard', label: 'داشبورد', icon: AdminIcons.Dashboard, path: '/admin' },
        { id: 'users', label: 'کاربران', icon: AdminIcons.Users, path: '/admin/users' },
        { id: 'news', label: 'اخبار', icon: AdminIcons.News, path: '/admin/news' },
        { id: 'shop', label: 'فروشگاه', icon: AdminIcons.Shop, path: '/admin/shop' },
        { id: 'settings', label: 'تنظیمات', icon: AdminIcons.Settings, path: '/admin/settings' },
      ];
    } else if (userData.is_author) {
      return [
        { id: 'news', label: 'اخبار', icon: AdminIcons.News, path: '/admin/news' },
      ];
    } else if (userData.is_seller) {
      return [
        { id: 'shop', label: 'فروشگاه', icon: AdminIcons.Shop, path: '/admin/shop' },
      ];
    }
    return [];
  };

  const tabs = getTabs();

  // تعیین تب فعال بر اساس مسیر فعلی
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => tab.path === currentPath);
    return activeTab ? activeTab.id : tabs[0]?.id || 'dashboard';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // لودینگ یا خطا
  if (userLoading) {
    return <SpinLoader />;
  }

  if (isAdminPannelAccess === null) {
    return <SpinLoader />;
  }

  if (!isAdminPannelAccess || userError) {
    return <PageNotFound />;
  }

  return (
    <div className="flex h-screen bg-quinary-tint-600">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 bg-quinary-tint-800 shadow-[0_0_16px_rgba(0,0,0,0.25)] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-quinary-tint-700">
          <h2 className="text-2xl font-bold text-primary">پنل مدیریت</h2>
          <p className="text-secondary text-sm mt-1">مدیریت محتوا و کاربران</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-grow px-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] font-medium transition-all duration-300 ${
                  getActiveTab() === tab.id
                    ? 'bg-primary text-quinary-tint-800'
                    : 'text-secondary hover:bg-quinary-tint-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon ? <tab.icon /> : <AdminIcons.Dashboard />}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-quinary-tint-700"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="p-2 bg-primary bg-opacity-20 rounded-full">
              <AdminIcons.User />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-secondary">خوش آمدید،</p>
              <p className="text-lg font-semibold text-primary">
                {(userData?.first_name && userData?.last_name) 
                  ? `${userData.first_name} ${userData.last_name}` 
                  : userData?.phone_number}
              </p>
              <div className="flex gap-2 mt-2">
                {userData?.is_superuser && (
                  <span className="px-2 py-1 rounded-full bg-quaternary text-quinary-tint-800 text-xs font-semibold">
                    ادمین
                  </span>
                )}
                {userData?.is_author && (
                  <span className="px-2 py-1 rounded-full bg-quaternary text-quinary-tint-800 text-xs font-semibold">
                    نویسنده
                  </span>
                )}
                {userData?.is_seller && (
                  <span className="px-2 py-1 rounded-full bg-quaternary text-quinary-tint-800 text-xs font-semibold">
                    فروشنده
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 text-secondary hover:text-quaternary transition-colors"
            >
              <AdminIcons.Logout />
            </button>
          </div>
          
          {/* Return to Website Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="mt-4 w-full py-2 px-4 bg-gradient-to-l from-primary to-primary-tint-200 text-quinary-tint-800 rounded-lg shadow-md hover:from-primary-tint-200 hover:to-primary transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
            </svg>
            بازگشت به سایت
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-quinary-tint-800 p-6 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-primary mb-4">تأیید خروج</h3>
            <p className="text-secondary mb-6">آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 bg-quinary-tint-700 text-secondary rounded-lg hover:bg-quinary-tint-600 transition-colors duration-300"
              >
                انصراف
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-quaternary text-quinary-tint-800 rounded-lg hover:bg-quaternary-tint-200 transition-colors duration-300 font-medium"
              >
                خروج
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
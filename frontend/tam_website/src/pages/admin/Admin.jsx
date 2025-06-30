import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fakeUsers } from '../data/fakeUsers';
import { newsData } from '../data/newsData';
import { 
  getAccessibleTabs, 
  canAccessTab, 
  canEditUser, 
  canManageRoles,
  getUserRole,
  ROLES 
} from '../../utils/roles';

const Admin = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userStatuses, setUserStatuses] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get accessible tabs for current user
  const accessibleTabs = getAccessibleTabs(user);
  
  // Set initial active tab to first accessible tab
  React.useEffect(() => {
    if (accessibleTabs.length > 0 && !accessibleTabs.includes(activeTab)) {
      setActiveTab(accessibleTabs[0]);
    }
  }, [accessibleTabs, activeTab]);

  const allTabs = [
    { id: 'dashboard', label: t('adminDashboard'), icon: Icons.Dashboard },
    { id: 'users', label: t('adminUsers'), icon: Icons.Users },
    { id: 'news', label: t('adminNews'), icon: Icons.News },
    { id: 'shop', label: t('adminShop'), icon: Icons.Shop },
    { id: 'settings', label: t('adminSettings'), icon: Icons.Settings },
  ];

  // Filter tabs based on user permissions
  const tabs = allTabs.filter(tab => canAccessTab(user, tab.id));

  // Calculate statistics
  const stats = {
    totalUsers: fakeUsers.length,
    totalNews: newsData.length,
    totalProducts: 0, // We'll implement this later
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddUser = () => {
    navigate('/admin/user/add');
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/user/edit/${userId}`);
  };

  const handleAddArticle = () => {
    navigate('/admin/article/add');
  };

  const handleEditArticle = (articleId) => {
    navigate(`/admin/article/edit/${articleId}`);
  };

  const handleToggleUserStatus = (userId) => {
    // Update local state for immediate UI feedback
    const newStatus = !getUserStatus(userId);
    setUserStatuses(prev => ({
      ...prev,
      [userId]: newStatus
    }));
    
    // Get user name for better message
    const userName = fakeUsers.find(u => u.id === userId)?.first_name || 'User';
    
    // Show success message
    setMessage({
      type: 'success',
      text: `User status changed to ${newStatus ? t('adminActive') : t('adminInactive')}`
    });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    
    // Here you would typically make an API call to update the user status
    console.log(`Toggling user ${userId} status to ${newStatus}`);
  };

  // Get current user status (local state or original data)
  const getUserStatus = (userId) => {
    return userStatuses.hasOwnProperty(userId) 
      ? userStatuses[userId] 
      : fakeUsers.find(u => u.id === userId)?.is_active || false;
  };

  if (!user || (getUserRole(user) !== ROLES.SUPER_ADMIN && 
                getUserRole(user) !== ROLES.ADMIN && 
                getUserRole(user) !== ROLES.AUTHOR && 
                getUserRole(user) !== ROLES.SELLER)) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-quinary-tint-600 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-quinary-tint-800 text-2xl font-bold">
                    {user?.phone?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 bg-tertiary rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className={`ml-4 ${isRTL ? 'text-right mr-4' : 'text-left'}`}>
                <h1 className="text-[24px] sm:text-[32px] font-bold text-primary">{t('adminWelcome')}</h1>
                <p className="text-[16px] sm:text-[18px] text-secondary">{user?.phone}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 sm:mt-0 px-6 py-2 bg-primary text-quinary-tint-800 text-[16px] font-semibold rounded-lg hover:bg-quaternary-tint-200 transition-colors duration-300 flex items-center gap-2"
            >
              <Icons.Logout />
              {t('adminLogout')}
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-quinary-tint-800'
                        : 'text-secondary hover:bg-quinary-tint-700'
                    }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-quinary-tint-800 rounded-2xl shadow-[0_0_16px_rgba(0,0,0,0.25)] p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <h2 className={`text-[24px] font-bold text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('adminDashboardOverview')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-primary rounded-xl p-6">
                        <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">{t('adminTotalUsers')}</h3>
                        <p className="text-[32px] font-bold text-quinary-tint-800">{stats.totalUsers}</p>
                      </div>
                      <div className="bg-primary rounded-xl p-6">
                        <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">{t('adminTotalNews')}</h3>
                        <p className="text-[32px] font-bold text-quinary-tint-800">{stats.totalNews}</p>
                      </div>
                      <div className="bg-primary rounded-xl p-6">
                        <h3 className="text-[18px] font-medium text-quinary-tint-800 mb-2">{t('adminTotalProducts')}</h3>
                        <p className="text-[32px] font-bold text-quinary-tint-800">{stats.totalProducts}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={`text-[24px] font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('adminUsersManagement')}
                      </h2>
                      {canManageRoles(user) && (
                        <button 
                          onClick={handleAddUser}
                          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          {t('adminAddUser')}
                        </button>
                      )}
                    </div>
                    <div className="bg-quinary-tint-600 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-primary text-quinary-tint-800">
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminStatus')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminPhoneNumber')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminFirstName')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminLastName')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminRole')}</th>
                              <th className={`px-6 py-3`}></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-quinary-tint-500">
                            {fakeUsers.map((userItem, index) => {
                              const userRole = getUserRole(userItem);
                              const canEdit = canEditUser(user, userItem);
                              const canToggleStatus = canManageRoles(user);
                              
                              return (
                                <tr key={index} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {canToggleStatus ? (
                                      <button
                                        onClick={() => handleToggleUserStatus(userItem.id)}
                                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                                          getUserStatus(userItem.id)
                                            ? 'bg-emerald-400 border-emerald-500 hover:bg-emerald-500 shadow-sm'
                                            : 'bg-rose-400 border-rose-500 hover:bg-rose-500 shadow-sm'
                                        }`}
                                        title={`${getUserStatus(userItem.id) ? t('adminActive') : t('adminInactive')} - ${t('adminClickToToggle')}`}
                                      />
                                    ) : (
                                      <div className={`w-4 h-4 rounded-full border-2 ${
                                        getUserStatus(userItem.id)
                                          ? 'bg-emerald-400 border-emerald-500'
                                          : 'bg-rose-400 border-rose-500'
                                      }`} />
                                    )}
                                  </td>
                                  <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{userItem.phone}</td>
                                  <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{userItem.first_name}</td>
                                  <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{userItem.last_name}</td>
                                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${
                                      userRole === ROLES.SUPER_ADMIN ? 'bg-red-100 text-red-800' :
                                      userRole === ROLES.ADMIN ? 'bg-blue-100 text-blue-800' :
                                      userRole === ROLES.AUTHOR ? 'bg-green-100 text-green-800' :
                                      userRole === ROLES.SELLER ? 'bg-yellow-100 text-yellow-800' :
                                      userRole === ROLES.USER ? 'bg-gray-100 text-gray-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {userRole === ROLES.SUPER_ADMIN ? t('roleSuperAdmin') :
                                       userRole === ROLES.ADMIN ? t('roleAdmin') :
                                       userRole === ROLES.AUTHOR ? t('roleAuthor') :
                                       userRole === ROLES.SELLER ? t('roleSeller') :
                                       userRole === ROLES.USER ? t('roleUser') :
                                       t('roleUser')}
                                    </span>
                                  </td>
                                  <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className="flex gap-2 justify-end">
                                      {canEdit && (
                                        <button 
                                          onClick={() => handleEditUser(userItem.id)}
                                          className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                                        >
                                          {t('adminEdit')}
                                        </button>
                                      )}
                                      {canManageRoles(user) && (
                                        <button className="px-3 py-1 bg-quaternary text-quinary-tint-800 rounded hover:bg-quaternary-tint-100 transition-colors duration-300">
                                          {t('adminDelete')}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'news' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={`text-[24px] font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('adminNewsManagement')}
                      </h2>
                      {canAccessTab(user, 'news') && (
                        <button 
                          onClick={handleAddArticle}
                          className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300"
                        >
                          {t('adminAddNews')}
                        </button>
                      )}
                    </div>
                    <div className="bg-quinary-tint-600 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-primary text-quinary-tint-800">
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminTitle')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminCategory')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminType')}</th>
                              <th className={`px-6 py-3 text-[16px] font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('adminViews')}</th>
                              <th className="px-6 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-quinary-tint-500">
                            {newsData.map((news) => (
                              <tr key={news.id} className="hover:bg-quinary-tint-500 transition-colors duration-200">
                                <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{news.title[i18n.language]}</td>
                                <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{news.category[i18n.language]}</td>
                                <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{news.type}</td>
                                <td className={`px-6 py-4 text-[16px] text-secondary ${isRTL ? 'text-right' : 'text-left'}`}>{news.views}</td>
                                <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                  <div className="flex gap-2 justify-end">
                                    {canAccessTab(user, 'news') && (
                                      <button 
                                        onClick={() => handleEditArticle(news.id)}
                                        className="px-3 py-1 bg-primary text-quinary-tint-800 rounded hover:bg-primary-tint-100 transition-colors duration-300"
                                      >
                                        {t('adminEdit')}
                                      </button>
                                    )}
                                    {canManageRoles(user) && (
                                      <button className="px-3 py-1 bg-quaternary text-quinary-tint-800 rounded hover:bg-quaternary-tint-100 transition-colors duration-300">
                                        {t('adminDelete')}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shop' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={`text-[24px] font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('adminShopManagement')}
                      </h2>
                      <button className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300">
                        {t('adminAddProduct')}
                      </button>
                    </div>
                    <div className="bg-quinary-tint-600 rounded-xl p-6">
                      <p className="text-secondary">{t('adminNoProducts')}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className={`text-[24px] font-bold text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('adminSettings')}
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-quinary-tint-600 rounded-xl p-6">
                        <h3 className="text-[18px] font-medium text-secondary mb-4">{t('adminGeneralSettings')}</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-secondary">{t('adminMaintenanceMode')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-secondary">{t('adminEnableComments')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-quinary-tint-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border-2 border-quinary-tint-400 shadow-inner hover:border-quinary-tint-300"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
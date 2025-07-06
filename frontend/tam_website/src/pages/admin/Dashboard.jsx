import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import SpinLoader from '../../components/UI/SpinLoader';
import SomethingWentWrong from '../../components/UI/SomethingWentWrong';
import { useNavigate } from 'react-router-dom';
import { AdminIcons } from '../../data/Icons';
import domainUrl from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentArticles, setRecentArticles] = useState([]);
  const [userGrowth] = useState({ 
    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
    data: [12, 19, 25, 31, 42, 48]
  });
  
  // گرفتن آمار کلی سایت
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError
  } = useAuthHttp(`http://${domainUrl}:8000/api/blog/admin-dashboard-data/`);

  // گرفتن اطلاعات کاربر
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError
  } = useAuthHttp(`http://${domainUrl}:8000/api/auth/user/`);

  // گرفتن مقالات اخیر
  const {
    data: articlesData,
    isLoading: articlesLoading,
    isError: articlesError
  } = useAuthHttp(`http://${domainUrl}:8000/api/blog/articles/`);

  useEffect(() => {
    if (articlesData?.articles) {
      setRecentArticles(articlesData.articles.slice(0, 5));
    }
  }, [articlesData]);

  if (statsLoading || userLoading || articlesLoading) {
    return <SpinLoader />;
  }

  if (statsError || userError || articlesError) {
    return <SomethingWentWrong />;
  }

  // محاسبه توزیع وضعیت مقالات
  const articleStatusData = [
    { 
      name: 'منتشر شده', 
      value: articlesData?.articles ? articlesData.articles.filter(a => a.status === 'published').length : 0, 
      color: '#10B981' 
    },
    { 
      name: 'پیش‌نویس', 
      value: articlesData?.articles ? articlesData.articles.filter(a => a.status === 'draft').length : 0, 
      color: '#F59E0B' 
    }
  ];

  // آمار سلامت سیستم (شبیه‌سازی شده)
  const systemHealth = {
    serverUptime: '99.9%',
    responseTime: '120ms',
    errorRate: '0.1%',
    diskUsage: '42%'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {    
    hidden: { y: 20, opacity: 0 },    
    visible: {      
      y: 0,      
      opacity: 1,      
      transition: { type: "spring", stiffness: 300, damping: 24 }    
    },    
    hover: {      
      scale: 1.05,      
      transition: { type: "spring", stiffness: 250, damping: 10 }    
    }  
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const drawVariants = {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">داشبورد</h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-quinary-tint-800 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
        >
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <p className="text-sm font-medium text-secondary">سیستم آنلاین</p>
        </motion.div>
      </div>
      
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* کاربران عادی */}
        <motion.div          
          variants={itemVariants}          
          whileHover="hover"          
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu"
        >          
          <div className="flex items-center justify-between">            
            <div>              
              <p className="text-sm font-medium text-secondary">کاربران عادی</p>              
              <p className="text-2xl font-semibold text-primary">{statsData?.users || 0}</p>            
            </div>            
            <div 
              className="p-3 bg-primary bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-primary hover:bg-opacity-30" 
              onClick={() => navigate('/admin/users')}
            >
              <AdminIcons.Users />
            </div>
          </div>
        </motion.div>

        {/* کاربران ادمین */}
        <motion.div          
          variants={itemVariants}          
          whileHover="hover"          
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu"
        >          
          <div className="flex items-center justify-between">            
            <div>              
              <p className="text-sm font-medium text-secondary">کاربران ادمین</p>              
              <p className="text-2xl font-semibold text-primary">{statsData?.adminUsers || 0}</p>            
            </div>            
            <div 
              className="p-3 bg-quaternary bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-quaternary hover:bg-opacity-30" 
              onClick={() => navigate('/admin/users')}
            >
              <AdminIcons.Users />
            </div>
          </div>
        </motion.div>

        {/* مقالات */}
        <motion.div          
          variants={itemVariants} 
          whileHover="hover"  
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu"
        >          
          <div className="flex items-center justify-between">            
            <div>              
              <p className="text-sm font-medium text-secondary">مقالات</p>              
              <p className="text-2xl font-semibold text-primary">{statsData?.articles || 0}</p>            
            </div>            
            <div 
              className="p-3 bg-green-500 bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-green-500 hover:bg-opacity-30"
              onClick={() => navigate('/admin/news')}
            >
              <AdminIcons.News />
            </div>
          </div>
        </motion.div>

        {/* دسته‌بندی‌ها */}
        <motion.div          
          variants={itemVariants}          
          whileHover="hover"          
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-xl transform-gpu"
        >          
          <div className="flex items-center justify-between">            
            <div>              
              <p className="text-sm font-medium text-secondary">دسته‌بندی‌ها</p>              
              <p className="text-2xl font-semibold text-primary">{statsData?.categories || 0}</p>            
            </div>            
            <div 
              className="p-3 bg-yellow-500 bg-opacity-20 rounded-full cursor-pointer transition-colors duration-300 hover:bg-yellow-500 hover:bg-opacity-30"
              onClick={() => navigate('/admin/categories')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* بخش میانی - نمودارها و فعالیت‌های اخیر */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* توزیع وضعیت محتوا */}
        <motion.div
          variants={itemVariants}
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] col-span-1"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">وضعیت محتوا</h2>
          <div className="relative h-52 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset="0"
                variants={drawVariants}
                style={{ transformOrigin: 'center' }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={
                  251.2 * (1 - (articleStatusData[0].value / (articleStatusData[0].value + articleStatusData[1].value)))
                }
                variants={drawVariants}
                style={{ transformOrigin: 'center' }}
              />
              <text x="50" y="45" textAnchor="middle" className="text-lg font-bold" fill="#4B5563">
                {articleStatusData[0].value}
              </text>
              <text x="50" y="60" textAnchor="middle" className="text-sm" fill="#4B5563">
                منتشر شده
              </text>
            </svg>
          </div>
          <div className="flex justify-around mt-4">
            {articleStatusData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-secondary">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* رشد کاربران */}
        <motion.div
          variants={itemVariants}
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] col-span-1"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">رشد کاربران</h2>
          <div className="h-52 w-full">
            <svg className="w-full h-full" viewBox="0 0 300 150">
              <motion.path
                d={`M 0,150 ${userGrowth.data.map((point, i) => 
                  `L ${(i * 50) + 10},${150 - point * 2}`).join(' ')}`}
                fill="none"
                stroke="#6366F1"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {userGrowth.data.map((point, i) => (
                <motion.circle
                  key={i}
                  cx={(i * 50) + 10}
                  cy={150 - point * 2}
                  r="4"
                  fill="#6366F1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                />
              ))}
              {userGrowth.labels.map((label, i) => (
                <text
                  key={i}
                  x={(i * 50) + 10}
                  y="170"
                  textAnchor="middle"
                  className="text-xs"
                  fill="#6B7280"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>
        </motion.div>

        {/* فعالیت‌های اخیر */}
        <motion.div
          variants={itemVariants}
          className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)] col-span-1"
        >
          <h2 className="text-lg font-semibold text-primary mb-4">فعالیت‌های اخیر</h2>
          <div className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 border-b border-quinary-tint-700 pb-3 last:border-0"
                >
                  <div className={`p-2 rounded-full ${article.status === 'published' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${article.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{article.title}</p>
                    <p className="text-xs text-secondary">
                      {new Date(article.updated_at).toLocaleDateString('fa-IR')} • {article.author_name}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-secondary text-sm">فعالیت اخیری وجود ندارد</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* سلامت سیستم */}
      <motion.div
        variants={fadeInVariants}
        className="bg-quinary-tint-800 p-6 rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.25)]"
      >
        <h2 className="text-lg font-semibold text-primary mb-4">سلامت سیستم</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(systemHealth).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-quinary-tint-700 p-4 rounded-lg"
            >
              <p className="text-sm font-medium text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-xl font-bold text-primary mt-1">{value}</p>
              <div className="mt-2 h-1 w-full bg-quinary-tint-600 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: parseInt(value) ? `${parseInt(value)}%` : '80%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* جدول زمانی فعالیت */}
      <motion.div
        variants={fadeInVariants}
        className="bg-gradient-to-bl from-primary to-primary-tint-200 p-6 rounded-lg shadow-xl text-quinary-tint-800 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-10 -mb-10"></div>
        
        <h2 className="text-xl font-bold mb-6 relative z-10 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          جدول زمانی فعالیت
        </h2>
        
        <div className="relative z-10">
          <div className="mr-6 border-r-2 border-white border-opacity-20 pr-8 pb-1">
            {[
              { 
                title: "مقاله جدید منتشر شد", 
                description: "راهنمای سفر: 10 مکان برتر برای بازدید",
                time: "همین الان", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                color: "bg-emerald-400"
              },
              { 
                title: "کاربر جدید ثبت‌نام کرد", 
                description: "سارا جانسون به پلتفرم پیوست",
                time: "2 ساعت پیش", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ),
                color: "bg-blue-400"
              },
              { 
                title: "دسته‌بندی به‌روزرسانی شد", 
                description: "توضیحات دسته‌بندی فناوری تغییر کرد",
                time: "دیروز", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ),
                color: "bg-amber-400"
              },
              { 
                title: "نگهداری سیستم", 
                description: "بهینه‌سازی سرور تکمیل شد",
                time: "2 روز پیش", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                color: "bg-indigo-400"
              }
            ].map((activity, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="mb-8 relative"
              >
                <div className={`absolute -right-12 w-6 h-6 rounded-full ${activity.color} flex items-center justify-center shadow-md`}>
                  {activity.icon}
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <p className="text-quinary-tint-800 text-opacity-80">{activity.description}</p>
                  </div>
                  <span className="text-xs bg-white bg-opacity-20 rounded-full px-3 py-1 mt-2 md:mt-0 inline-block whitespace-nowrap">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="mt-4 bg-white bg-opacity-20 rounded-lg p-4 cursor-pointer hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center relative z-10"
          onClick={() => navigate('/admin/news')}
        >
          <span className="font-medium">مشاهده همه فعالیت‌ها</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import useAdminHttp from '../../../hooks/useAdminHttp';
import SpinLoader from '../../../pages/UI/SpinLoader';
import SomethingWentWrong from '../../../pages/UI/SomethingWentWrong';
import { AuthContext } from '../../../context/AuthContext';
import { API_PREFIX } from '../../../reverse_proxy';
import UsersStatCard from '../../../components/admin/dashboard/UsersStatCard';
import ArticlesStatCard from '../../../components/admin/dashboard/ArticlesStatCard';
import TeamsStatCard from '../../../components/admin/dashboard/TeamsStatCard';
import PlayersStatCard from '../../../components/admin/dashboard/PlayersStatCard';
import TotalViewsStatCard from '../../../components/admin/dashboard/TotalViewsStatCard';
import DashboardContentStatus from '../../../components/admin/dashboard/DashboardContentStatus';
import TopViewedArticles from '../../../components/admin/dashboard/TopViewedArticles';
import TopLikedArticles from '../../../components/admin/dashboard/TopLikedArticles';

const Dashboard = () => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  
  // گرفتن همه اطلاعات داشبورد از یک API
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useAdminHttp(`${API_PREFIX}/admin/admin-dashboard-data/`);

  if (dashboardLoading) {
    return <SpinLoader />;
  }

  if (dashboardError) {
    return <SomethingWentWrong />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const isSuperuser = user?.is_superuser;
  const isAuthor = user?.is_author && !isSuperuser; // Only author if not superuser

  const dashboardCards = [];

  if (isSuperuser) {
    dashboardCards.push(
      <UsersStatCard
        key="users"
        users={dashboardData?.users}
      />
    );
  }

  dashboardCards.push(
    <ArticlesStatCard
      key="articles"
      articles={dashboardData?.articles}
      isSuperuser={isSuperuser}
    />,
    <TeamsStatCard
      key="teams"
      teams={dashboardData?.teams}
      isSuperuser={isSuperuser}
    />,
    <PlayersStatCard
      key="players"
      players={dashboardData?.players}
      isSuperuser={isSuperuser}
    />
  );

  dashboardCards.push(
    <TotalViewsStatCard
      key="total_views"
      totalViews={dashboardData?.total_views}
      isSuperuser={isSuperuser}
    />
  );

  // Reorder for superuser as per request: کل کاربران, مقالات, تیم‌ها, بازیکن‌ها, بازدید کلی
  const orderedSuperuserCards = [
    dashboardCards.find(card => card.key === 'users'),
    dashboardCards.find(card => card.key === 'articles'),
    dashboardCards.find(card => card.key === 'teams'),
    dashboardCards.find(card => card.key === 'players'),
    dashboardCards.find(card => card.key === 'total_views'),
  ].filter(Boolean);

  // Author cards: مقالات, تیم‌ها, بازیکن‌ها, بازدید کلی
  const orderedAuthorCards = [
    dashboardCards.find(card => card.key === 'articles'),
    dashboardCards.find(card => card.key === 'teams'),
    dashboardCards.find(card => card.key === 'players'),
    dashboardCards.find(card => card.key === 'total_views'),
  ].filter(Boolean);

  const cardsToRender = isSuperuser ? orderedSuperuserCards : (isAuthor ? orderedAuthorCards : []);

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
          <p className="text-sm font-medium text-secondary">آنلاین</p>
        </motion.div>
      </div>
      
      {/* کارت‌های آمار */}
      <motion.div
        className={`grid gap-6 ${isSuperuser ? 'grid-cols-5' : 'grid-cols-4'}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.35, delayChildren: 0.2 }
          }
        }}
      >
        {cardsToRender}
      </motion.div>

      {/* بخش میانی - نمودارها و لیست‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* توزیع وضعیت محتوا */}
        <DashboardContentStatus
          publishedArticles={dashboardData?.published_articles}
          draftArticles={dashboardData?.draft_articles}
        />

        {/* مقالات پربازدید */}
        <TopViewedArticles articles={dashboardData?.top_viewed_articles} />

        {/* مقالات محبوب */}
        <TopLikedArticles articles={dashboardData?.top_liked_articles} />
      </div>
    </motion.div>
  );
};

export default Dashboard;

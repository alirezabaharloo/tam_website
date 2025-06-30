import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// blog routes
import Home from './pages/blog/Home';
import About from './pages/blog/About';
import Shop from './pages/Shop';
import News from './pages/blog/News';
import NewsDetail from './components/blog/NewsDetail';
// auth routes
import Login from './pages/auth/Login';
import Profile from './pages/auth/Profile';
import PageNotFound from './pages/PageNotFound';
import OtpVerification from './pages/auth/OtpVerification';
import Register from './pages/auth/Register';
// admin routes
import AdminLayout from './layout/AdminLayout';
import Admin from './pages/admin/Admin';
// import ArticleForm from './pages/admin/ArticleForm';
// import UserForm from './pages/admin/UserForm';


const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const WebsiteRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* BLOG routes */}
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <About />
          </PageTransition>
        } />
        <Route path="/shop" element={
          <PageTransition>
            <Shop />
          </PageTransition>
        } />
        <Route path="/news" element={
          <PageTransition>
            <News />
          </PageTransition>
        } />
        <Route path="/news/:slug" element={
          <PageTransition>
            <NewsDetail />
          </PageTransition>
        } />

        {/* AUTH routes */}
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Register />
          </PageTransition>
        } />
        <Route path="/otp-code" element={
          <PageTransition>
            <OtpVerification />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <Profile />
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition>
            <Error />
          </PageTransition>
        } />

        {/* ADMIN routes */}
        <Route path="/admin/*" element={<AdminLayout />} >
          <Route index element={<Admin />} />
        </Route>
      
      </Routes>
    </AnimatePresence>
  );
};

export { WebsiteRoutes };

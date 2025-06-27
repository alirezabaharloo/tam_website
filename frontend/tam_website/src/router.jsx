import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import News from './pages/News';
import NewsDetail from './components/NewsDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Error from './pages/Error';
import OtpVerification from './pages/OtpVerification';
import Register from './pages/Register';


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

const BlogRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
      </Routes>
    </AnimatePresence>
  );
};

// const AdminRoutes = () => {
//   return (
//     <>
//       <Route path="/admin" element={<Admin />} />
//       <Route path="/admin/user/add" element={<UserForm />} />
//       <Route path="/admin/user/edit/:userId" element={<UserForm />} />
//       <Route path="/admin/article/add" element={<ArticleForm />} />
//       <Route path="/admin/article/edit/:id" element={<ArticleForm />} />
//     </>
//   )
// }

export { BlogRoutes };

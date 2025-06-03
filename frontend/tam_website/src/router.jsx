import { Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import News from './pages/News';
import NewsDetail from './components/NewsDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Error from './pages/Error';
import { Routes } from 'react-router-dom';
import OtpVerification from './pages/OtpVerification';
import Register from './pages/Register';
import SpinLoader from './components/UI/SpinLoader'


const BlogRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<NewsDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-code" element={<OtpVerification />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Error />} />      
    </Routes>
  );
}

// const AdminRoutes = () => {
//   return (
//     <>
    
//     </>
//   )
// }

export { BlogRoutes };

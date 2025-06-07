import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Divider from "./components/Divider"
import ContactBoxes from "./components/ContactBoxes"
import LogoSection from "./components/LogoSection"
import './i18n';
import { loadNamespaces } from './i18n';
import { AuthProvider } from './context/AuthContext';
import { BlogRoutes } from './router.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import useLanguageChange from './hooks/useLanguageChange';
import { SearchProvider } from './context/SearchContext';
import SpinLoader from './components/UI/SpinLoader.jsx';


// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  // Ensure the blog namespace is loaded
  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
    
    // Load core namespace
    loadNamespaces('blog');
  }, [i18n.language]);

  // Use the language change hook
  useLanguageChange();

  return (
    <SearchProvider>
      <Router>
        <AuthProvider>
          <ToastContainer rtl={isRTL} />
          <ScrollToTop />
          <div className="min-h-screen bg-quinary-tint-600">
            <Header />
            <Suspense fallback={SpinLoader}>
              <BlogRoutes />
            </Suspense>
            <Divider />
            <ContactBoxes />
            <Divider />
            <Footer />
            <LogoSection />
          </div>
        </AuthProvider>
      </Router>
    </SearchProvider>
  );
}

export default App;

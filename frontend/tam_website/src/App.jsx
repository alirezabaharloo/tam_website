import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from "./components/blog/Header.jsx"
import Footer from "./components/blog/Footer.jsx"
import Divider from "./components/blog/Divider.jsx"
import ContactBoxes from "./components/blog/ContactBoxes.jsx"
import LogoSection from "./components/blog/LogoSection.jsx"
import './i18n';
import { loadNamespaces } from './i18n';
import { AuthProvider } from './context/AuthContext';
import { WebsiteRoutes } from './router.jsx';
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

// Component to render content based on admin path
function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'fa';
  const isAdminPath = location.pathname.startsWith('/admin');

  // Use the language change hook
  useLanguageChange();

  return (
    <div className="min-h-screen bg-quinary-tint-600">
      {/* Only show header, footer, and other site elements if NOT on admin path */}
      {!isAdminPath && (
        <>
          <Header />
          <Suspense fallback={<SpinLoader />}>
            <WebsiteRoutes />
          </Suspense>
          <Divider />
          <ContactBoxes />
          <Divider />
          <Footer />
          <LogoSection />
        </>
      )}
      
      {/* Show only routes for admin paths */}
      {isAdminPath && (
        <Suspense fallback={<SpinLoader />}>
          <WebsiteRoutes />
        </Suspense>
      )}
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  // Ensure the blog namespace is loaded
  useEffect(() => {
    // Set document direction and language based on language
    document.documentElement.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

    // Load core namespace
    loadNamespaces('blog');
  }, [i18n.language]);

  return (
    <SearchProvider>
      <Router>
        <AuthProvider>
          <ToastContainer rtl={isRTL} />
          <ScrollToTop />
          <AppContent />
        </AuthProvider>
      </Router>
    </SearchProvider>
  );
}

export default App;

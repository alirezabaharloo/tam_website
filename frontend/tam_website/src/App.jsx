import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Divider from "./components/Divider"
import ContactBoxes from "./components/ContactBoxes"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Shop from "./pages/Shop"
import News from "./pages/News"
import NewsDetail from "./components/NewsDetail"
import LogoSection from "./components/LogoSection"
import Error from "./pages/Error"
import Login from "./pages/Login"

// AuthContext setup (move to its own file in a real project)
const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  // In a real app, you would check localStorage, cookies, or an API
  const [user, setUser] = useState(null); // null means not logged in
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

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

function Dashboard() {
  const { setUser } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rememberedUser');
    navigate('/login');
  };
  return (
    <div className="w-[1300px] mx-auto mt-16 text-center text-3xl text-primary flex flex-col items-center gap-8">
      <div>Welcome to your dashboard!</div>
      <button onClick={handleLogout} className="px-8 py-3 bg-quaternary-tint-800 text-primary text-lg font-medium rounded-lg hover:bg-quaternary-tint-600 transition-colors duration-300">Logout</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-quinary-tint-600">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Error />} />
          </Routes>
          <Divider />
          <ContactBoxes />
          <Divider />
          <Footer />
          <LogoSection />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
export { AuthContext };

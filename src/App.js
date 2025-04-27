import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Divider from "./components/Divider"
import ContactBoxes from "./components/ContactBoxes"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Shop from "./pages/Shop"
import News from "./pages/News"
import NewsDetail from "./pages/NewsDetail"
import LogoSection from "./components/LogoSection"
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-quinary-tint-600">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Routes>
        <Divider />
        <ContactBoxes />
        <Divider />
        <Footer />
        <LogoSection />
      </div>
    </Router>
  );
}

export default App;

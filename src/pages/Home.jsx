import React, { useState, useEffect } from 'react';
import Slider from '../components/Slider';
import LatestNews from '../components/LatestNews';
import LatestVideos from '../components/LatestVideos';
import TeamBoxes from '../components/TeamBoxes';
import ShopSection from '../components/ShopSection';
import PlayerSection from '../components/PlayerSection';
import Modal from '../components/Modal';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const modalData = {
    title: "Welcome To Our Website",
    content: "Welcome to TamSport! We're excited to have you here. Explore our latest news, videos, and team updates. Enjoy your visit!",
    onlyAcceptable: false
  };

  return (
    <div className="relative mt-4">
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={modalData}
      />
      <div id="slider">
        <Slider />
      </div>
      <div id="latest-news">
        <LatestNews />
      </div>
      <div id="latest-videos">
        <LatestVideos />
      </div>
      <div id="team-boxes">
        <TeamBoxes />
      </div>
      <div id="shop-section">
        <ShopSection />
      </div>
      <div id="player-section">
        <PlayerSection />
      </div>
    </div>
  );
};

export default Home;

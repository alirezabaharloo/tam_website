import React from 'react';
import Slider from '../components/Slider';
import LatestNews from '../components/LatestNews';
import LatestVideos from '../components/LatestVideos';
import TeamBoxes from '../components/TeamBoxes';
import ShopSection from '../components/ShopSection';
import PlayerSection from '../components/PlayerSection';
import Divider from '../components/Divider';
import ContactBoxes from '../components/ContactBoxes';
import Footer from '../components/Footer';
import LogoSection from '../components/LogoSection';

const Home = () => {
  return (
    <div className="relative mt-4">
      <Slider />
      <LatestNews />
      <LatestVideos />
      <TeamBoxes />
      <ShopSection />
      <PlayerSection />
      <Divider />
      <ContactBoxes />
      <Divider />
      <Footer />
      <LogoSection />
    </div>
  );
};

export default Home;

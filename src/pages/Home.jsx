import React from 'react';
import Slider from '../components/Slider';
import LatestNews from '../components/LatestNews';
import LatestVideos from '../components/LatestVideos';
import TeamBoxes from '../components/TeamBoxes';
import ShopSection from '../components/ShopSection';

const Home = () => {
  return (
    <div className="relative mt-4">
      <Slider />
      <LatestNews />
      <LatestVideos />
      <TeamBoxes />
      <ShopSection />
    </div>
  );
};

export default Home;

import React from 'react';
import { HomeProvider } from '../context/HomeContext';
import LatestNews from '../components/LatestNews';
import LatestVideos from '../components/LatestVideos';
import TeamBoxes from '../components/TeamBoxes';
import PlayerSection from '../components/PlayerSection';
import SpinLoader from '../components/UI/SpinLoader';
import SomethingWentWrong from '../components/UI/SomethingWentWrong';
import { useHome } from '../context/HomeContext';
import Slider from '../components/Slider.jsx'
import ShopSection from '../components/ShopSection.jsx'


const HomeContent = () => {
  const { isLoading, isError } = useHome();

  if (isError) {
    return <SomethingWentWrong />;
  }

  if (isLoading) {
    return <SpinLoader />;
  }

  return (
    <div className="relative mt-4">
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

export default function Home() {
  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
}


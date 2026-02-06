import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api.js';
import LatestNews from '../../components/blog/LatestNews.jsx';
import LatestVideos from '../../components/blog/LatestVideos.jsx';
import TeamBoxes from '../../components/blog/TeamBoxes.jsx';
import PlayerSection from '../../components/blog/PlayerSection.jsx';
import SpinLoader from '../../pages/UI/SpinLoader.jsx';
import SomethingWentWrong from '../../pages/UI/SomethingWentWrong.jsx';
import Slider from '../../components/blog/Slider.jsx'
import ShopSection from '../../components/blog/ShopSection.jsx'

// Query function to fetch home data
const fetchHomeData = async () => {
  const response = await api.get('/blog/home-datas/');
  return response.data;
};

export default function Home() {
  const { data: homeData, isLoading, isError } = useQuery({
    queryKey: ['homeData'],
    queryFn: fetchHomeData,
  });

  if (isError) {
    return <SomethingWentWrong />;
  }

  if (isLoading) {
    return <SpinLoader />;
  }

  // Provide default empty arrays if data is not available
  const articles = homeData?.articles || [];
  const videos = homeData?.videos || [];
  const tam_teams = homeData?.tam_teams || [];
  const players = homeData?.players || [];

  return (
    <div className="relative mt-4">
      <div id="slider">
        <Slider />
      </div>
      <div id="latest-news">
        <LatestNews articles={articles} />
      </div>
      <div id="latest-videos">
        <LatestVideos videos={videos} />
      </div>
      <div id="team-boxes">
        <TeamBoxes tam_teams={tam_teams} />
      </div>
      <div id="shop-section">
        <ShopSection />
      </div>
      <div id="player-section">
        <PlayerSection players={players} />
      </div>
    </div>
  );
}


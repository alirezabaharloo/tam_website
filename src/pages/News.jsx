import React, { useState } from 'react'
import NewsFilter from '../components/NewsFilter'
import NewsBox from '../components/NewsBox'

export default function News() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(12);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'article', label: 'Articles' },
    { id: 'video', label: 'Videos' },
    { id: 'slideshow', label: 'Slideshows' }
  ];

  // Test data
  const newsData = [
    {
      id: 1,
      title: "Team Wins Championship",
      image: "/images/banners/ArticlePicture2.png",
      type: "article",
      date: "22H",
      category: "ُSECOND TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 2,
      title: "Player Interview",
      image: "/images/banners/ArticlePicture2.png",
      type: "video",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 3,
      title: "Season Highlights",
      image: "/images/banners/ArticlePicture2.png",
      type: "slideshow",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 4,
      title: "New Stadium Plans",
      image: "/images/banners/ArticlePicture2.png",
      type: "article",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 5,
      title: "Training Session",
      image: "/images/banners/ArticlePicture2.png",
      type: "video",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 6,
      title: "Fan Day Photos",
      image: "/images/banners/ArticlePicture2.png",
      type: "slideshow",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 7,
      title: "Transfer News",
      image: "/images/banners/ArticlePicture2.png",
      type: "article",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 8,
      title: "Match Analysis",
      image: "/images/banners/ArticlePicture2.png",
      type: "video",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 9,
      title: "Team Gallery",
      image: "/images/banners/ArticlePicture2.png",
      type: "slideshow",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 10,
      title: "Press Conference",
      image: "/images/banners/ArticlePicture2.png",
      type: "article",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 11,
      title: "Behind the Scenes",
      image: "/images/banners/ArticlePicture2.png",
      type: "video",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 12,
      title: "Behind the Scenes",
      image: "/images/banners/ArticlePicture2.png",
      type: "video",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 13,
      title: "Season Review",
      image: "/images/banners/ArticlePicture2.png",
      type: "slideshow",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 14,
      title: "Season Review",
      image: "/images/banners/ArticlePicture2.png",
      type: "slideshow",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 15,
      title: "Season Review",
      image: "/images/banners/ArticlePicture2.png",
      type: "slideshow",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    },
    {
      id: 16,
      title: "Season Review",
      image: "/images/banners/ArticlePicture2.png",
      type: "slideshow",
      date: "10H",
      category: "FIRST TEAM",
      description: "What did the boss make of Patrick's first appearance for the club? Find out here."
    }
  ];

  const filteredNews = activeFilter === 'all' 
    ? newsData 
    : newsData.filter(news => news.type === activeFilter);

  const displayedNews = filteredNews.slice(0, displayCount);
  const hasMoreNews = displayCount < filteredNews.length;

  const handleLearnMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setDisplayCount(12);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mt-8">
        <NewsFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
      </div>
      <div className="mt-8">
        <div className="w-[1300px] mx-auto">
          <div className="grid grid-cols-3 gap-5">
            {displayedNews.map((news) => (
              <NewsBox key={news.id} news={news} />
            ))}
          </div>
          {hasMoreNews && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={handleLearnMore}
                className="text-[32px] font-medium text-secondary-tint-500 relative group"
              >
                Learn More
                <span className="absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-500 ease-in-out group-hover:w-full bg-secondary-tint-500"></span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

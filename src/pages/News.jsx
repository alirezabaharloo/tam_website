import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import NewsFilter from '../components/NewsFilter'
import NewsBox from '../components/NewsBox'
import { newsData } from '../data/newsData'

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    // Get filter from URL parameter
    const filterFromUrl = searchParams.get('type');
    if (filterFromUrl && ['all', 'basic', 'video', 'slideshow'].includes(filterFromUrl)) {
      setActiveFilter(filterFromUrl);
      // Scroll to top when filter changes from URL
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [searchParams]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'basic', label: 'Articles' },
    { id: 'video', label: 'Videos' },
    { id: 'slideshow', label: 'Slideshows' }
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
    setSearchParams({ type: filterId });
    setDisplayCount(12);
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

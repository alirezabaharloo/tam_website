import React from 'react';
import { useNavigate } from 'react-router-dom';
import { newsData } from '../data/newsData';

const LatestNews = () => {
  const navigate = useNavigate();

  // Get the latest 5 basic news items
  const latestNews = [...newsData]
    .filter(news => news.type === 'basic')
    .sort((a, b) => {
      // Convert time strings to numbers for comparison
      const timeA = parseInt(a.date.replace('H', ''));
      const timeB = parseInt(b.date.replace('H', ''));
      return timeA - timeB;
    })
    .slice(0, 5);

  // Split into two groups: first two and last three
  const [firstTwo, lastThree] = [
    latestNews.slice(0, 2),
    latestNews.slice(2)
  ];

  return (
    <>
      <div className="w-[1300px] mx-auto mt-12 flex justify-between items-center">
        <h2 className="text-[48px] font-regular text-secondary">Latest News</h2>
        <button 
          onClick={() => navigate('/news')}
          className="flex items-center gap-1 text-[24px] text-secondary-tint-200 hover:text-secondary-tint-600 transition-colors duration-300 no-underline group"
        >
          VIEW ALL
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-secondary-tint-200 group-hover:text-secondary-tint-600 transition-colors duration-300"
          >
            <path 
              d="M5 12H19M19 12L12 5M19 12L12 19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* First Two Large Articles */}
      <div className="w-[1300px] mx-auto mt-8 flex justify-between">
        {firstTwo.map((news) => (
          <div 
            key={news.id} 
            className="w-[640px] h-[380px] rounded-lg bg-quinary-tint-800 shadow-[4px_4px_16px_rgba(0,0,0,0.25)] overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/news/${news.id}`)}
          >
            <div className="flex h-full">
              {/* Left side - Image */}
              <div className="w-1/2 h-full overflow-hidden">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              {/* Right side - Content */}
              <div className="w-1/2 p-4 flex flex-col">
                <div className="h-[1px] w-3 bg-quaternary transition-all duration-300 group-hover:w-[100px]"></div>
                <h3 className="text-[20px] font-bold text-secondary mt-[8px]">{news.title}</h3>
                <p className="text-[14px] font-medium text-secondary-tint-100 mt-4">
                  {news.description}
                </p>
                
                <div className="mt-auto flex items-center">
                  <span className="text-[12px] font-regular text-secondary-tint-200">{news.date}</span>
                  <div className="h-4 w-[1px] bg-secondary mx-4"></div>
                  <span className="text-[12px] font-regular text-quaternary">{news.category}</span>
                  <svg 
                    className="ml-auto w-4 h-4 text-secondary" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Three Bottom Boxes Section */}
      <div className="w-[1300px] mx-auto mt-[34px] flex justify-between">
        {lastThree.map((news) => (
          <div 
            key={news.id} 
            className="w-[420px] h-[340px] rounded-lg bg-quinary-tint-800 shadow-[4px_4px_16px_rgba(0,0,0,0.25)] overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/news/${news.id}`)}
          >
            {/* Top Half - Image Section */}
            <div className="h-1/2 relative overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-2 left-2">
                <div className="h-[1px] w-3 bg-quaternary transition-all duration-300 group-hover:w-[100px]"></div>
              </div>
            </div>
            
            {/* Bottom Half - Content Section */}
            <div className="h-1/2 p-2 flex flex-col">
              <h3 className="text-[20px] font-bold text-secondary mt-[8px]">{news.title}</h3>
              <p className="text-[14px] font-medium text-secondary-tint-100 mt-2">
                {news.description}
              </p>
              
              <div className="mt-auto flex items-center">
                <span className="text-[12px] font-regular text-secondary-tint-200">{news.date}</span>
                <div className="h-4 w-[1px] bg-secondary mx-4"></div>
                <span className="text-[12px] font-regular text-quaternary">{news.category}</span>
                <svg 
                  className="ml-auto w-4 h-4 text-secondary" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LatestNews; 
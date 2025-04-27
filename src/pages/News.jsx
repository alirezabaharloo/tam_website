import React, { useState } from 'react'

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

  return (
    <div className="container mx-auto px-4">
      <div className="mt-8">
        <div className="w-[1300px] mx-auto relative">
          <div className="flex items-center h-full">
            <nav className="flex space-x-6 ml-8">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setDisplayCount(12);
                  }}
                  className={`font-inter text-[24px] leading-6 no-underline transition-all duration-500 ease-in-out relative group ${
                    activeFilter === filter.id ? 'text-quaternary' : 'text-secondary hover:text-quaternary'
                  }`}
                >
                  {filter.label}
                  <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-500 ease-in-out ${
                    activeFilter === filter.id ? 'w-full bg-quaternary' : 'group-hover:w-full bg-quaternary'
                  }`}></span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="w-[1300px] mx-auto">
          <div className="grid grid-cols-3 gap-5">
            {displayedNews.map((news) => (
              <div key={news.id} className="w-[420px] h-[340px] rounded-lg bg-quinary-tint-800 shadow-[4px_4px_16px_rgba(0,0,0,0.25)] overflow-hidden group cursor-pointer">
                {/* Top Half - Image Section */}
                <div className="h-1/2 relative overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {news.type === 'video' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9 text-quinary-tint-800">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <div className="h-[1px] w-3 bg-quaternary transition-all duration-300 group-hover:w-[100px]"></div>
                  </div>
                </div>
                
                {/* Bottom Half - Content Section */}
                <div className="h-1/2 p-2 flex flex-col">
                  <div className="flex items-center">
                    {news.type === 'slideshow' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                      </svg>
                    )}
                    {news.type === 'video' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[21px] h-[21px] text-secondary mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                      </svg>
                    )}
                    <h3 className="text-[20px] font-bold text-secondary">{news.title}</h3>
                  </div>
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

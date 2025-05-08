import React from 'react';
import { useNavigate } from 'react-router-dom';
import { newsData } from '../data/newsData';

const LatestVideos = () => {
  const navigate = useNavigate();

  // Get the latest 5 video news items
  const latestVideos = [...newsData]
    .filter(news => news.type === 'video')
    .sort((a, b) => {
      // Convert time strings to numbers for comparison
      const timeA = parseInt(a.date.replace('H', ''));
      const timeB = parseInt(b.date.replace('H', ''));
      return timeA - timeB;
    })
    .slice(0, 5);

  // Split into two groups: first two and last three
  const [firstTwo, lastThree] = [
    latestVideos.slice(0, 2),
    latestVideos.slice(2)
  ];

  return (
    <>
      <div className="w-[1300px] mx-auto mt-8 flex justify-between items-center">
        <h2 className="text-[48px] font-regular text-secondary">Latest Videos</h2>
        <button 
          onClick={() => navigate('/news?type=video')}
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

      <div className="w-[1300px] mx-auto mt-8 flex justify-between">
        {firstTwo.map((video) => (
          <div 
            key={video.id} 
            className="w-[640px] h-[380px] rounded-lg overflow-hidden relative group cursor-pointer"
            onClick={() => navigate(`/news/${video.id}`)}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={video.image} 
                alt={video.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  console.error('Error loading image:', video.image)
                  e.target.src = "/images/banners/ArticlePicture2.png"
                }}
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Top Line */}
            <div className="absolute top-6 left-6">
              <div className="h-[2px] w-[20px] bg-quinary-tint-800 transition-all duration-300 group-hover:w-[200px]"></div>
            </div>

            {/* Top Info */}
            <div className="absolute top-[18px] right-6 flex items-center">
              <span className="text-[14px] font-medium text-quinary-tint-800">{video.date}</span>
              <div className="mx-2 h-4 w-[1px] bg-quinary-tint-800"></div>
              <span className="text-[14px] font-medium text-tertiary-tint-200">{video.category}</span>
            </div>

            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="0.5 "
                stroke="currentColor" 
                className="w-[68px] h-[68px] text-quinary-tint-800"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" 
                />
              </svg>
            </div>

            {/* Bottom Title */}
            <div className="absolute bottom-8 left-6">
              <h3 className="text-[32px] font-bold text-quinary-tint-800">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Small Video Boxes */}
      <div className="w-[1300px] mx-auto mt-8 flex justify-between">
        {lastThree.map((video) => (
          <div 
            key={video.id} 
            className="w-[420px] h-[220px] rounded-lg overflow-hidden relative group cursor-pointer"
            onClick={() => navigate(`/news/${video.id}`)}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={video.image} 
                alt={video.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  console.error('Error loading image:', video.image)
                  e.target.src = "/images/banners/ArticlePicture2.png"
                }}
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Top Line */}
            <div className="absolute top-4 left-4">
              <div className="h-[1px] w-[12px] bg-quinary-tint-800 transition-all duration-300 group-hover:w-[100px]"></div>
            </div>

            {/* Top Info */}
            <div className="absolute top-4 right-4 flex items-center">
              <span className="text-[12px] font-regular text-quinary-tint-800">{video.date}</span>
              <div className="mx-2 h-4 w-[1px] bg-quinary-tint-800"></div>
              <span className="text-[12px] font-regular text-tertiary-tint-200">{video.category}</span>
            </div>

            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="0.5"
                stroke="currentColor" 
                className="w-[48px] h-[48px] text-quinary-tint-800"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" 
                />
              </svg>
            </div>

            {/* Bottom Title */}
            <div className="absolute bottom-4 left-4">
              <h3 className="text-[20px] font-bold text-quinary-tint-800">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LatestVideos; 
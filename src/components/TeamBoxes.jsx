import React, { useState } from 'react';

const TeamBoxes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <div className="w-[1300px] mx-auto mt-12 flex justify-between items-center">
        <h2 className="text-[48px] font-regular text-secondary">TAM'S TEAM</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            className="w-12 h-12 rounded-full hover:bg-secondary-tint-800 transition-colors duration-300 flex items-center justify-center group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6 text-secondary group-hover:text-secondary-tint-200 transition-colors duration-300"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 19.5L8.25 12l7.5-7.5" 
              />
            </svg>
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(6, prev + 1))}
            className="w-12 h-12 rounded-full hover:bg-secondary-tint-800 transition-colors duration-300 flex items-center justify-center group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6 text-secondary group-hover:text-secondary-tint-200 transition-colors duration-300"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M8.25 4.5l7.5 7.5-7.5 7.5" 
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-[1300px] mx-auto mt-6">
        <div className="flex overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 220}px)` }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
              <div key={index} className="relative w-[200px] h-[340px] rounded-[16px] overflow-hidden group cursor-pointer flex-shrink-0 mr-5">
                <div className="absolute inset-0">
                  <img 
                    src="/images/banners/ArticlePicture.png" 
                    alt="Team Image" 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute bottom-3 left-1.5 right-1.5 flex items-center justify-center gap-1.5">
                  <span className="text-[24px] font-bold text-quinary-tint-800">FOOTBALL</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6 text-quinary-tint-800"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" 
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamBoxes; 
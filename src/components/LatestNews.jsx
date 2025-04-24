import React from 'react';

const LatestNews = () => {
  return (
    <>
      <div className="w-[1300px] mx-auto mt-12 flex justify-between items-center">
        <h2 className="text-[48px] font-regular text-secondary">Latest News</h2>
        <a 
          href="#" 
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
        </a>
      </div>

      <div className="w-[1300px] mx-auto mt-8 flex justify-between">
        {/* First News Box */}
        <div className="w-[640px] h-[380px] rounded-lg bg-quinary-tint-800 shadow-[4px_4px_16px_rgba(0,0,0,0.25)] overflow-hidden group cursor-pointer">
          <div className="flex h-full">
            {/* Left side - Image */}
            <div className="w-1/2 h-full overflow-hidden">
              <img 
                src="/images/banners/ArticlePicture.png" 
                alt="News Image" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Right side - Content */}
            <div className="w-1/2 p-4 flex flex-col">
              <div className="h-[1px] w-3 bg-quaternary transition-all duration-300 group-hover:w-[100px]"></div>
              <h3 className="text-[20px] font-bold text-secondary mt-[8px]">Amorim hails Dorgu's debut</h3>
              <p className="text-[14px] font-medium text-secondary-tint-100 mt-4">
                What did the boss make of Patrick's first appearance for the club? Find out here.
              </p>
              
              <div className="mt-auto flex items-center">
                <span className="text-[12px] font-regular text-secondary-tint-200">10H</span>
                <div className="h-4 w-[1px] bg-secondary mx-4"></div>
                <span className="text-[12px] font-regular text-quaternary">FIRST TEAM</span>
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

        {/* Second News Box */}
        <div className="w-[640px] h-[380px] rounded-lg bg-quinary-tint-800 shadow-[4px_4px_16px_rgba(0,0,0,0.25)] overflow-hidden group cursor-pointer">
          <div className="flex h-full">
            {/* Left side - Image */}
            <div className="w-1/2 h-full overflow-hidden">
              <img 
                src="/images/banners/ArticlePicture.png" 
                alt="News Image" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Right side - Content */}
            <div className="w-1/2 p-4 flex flex-col">
              <div className="h-[1px] w-3 bg-quaternary transition-all duration-300 group-hover:w-[100px]"></div>
              <h3 className="text-[20px] font-bold text-secondary mt-[8px]">Amorim hails Dorgu's debut</h3>
              <p className="text-[14px] font-medium text-secondary-tint-100 mt-4">
                What did the boss make of Patrick's first appearance for the club? Find out here.
              </p>
              
              <div className="mt-auto flex items-center">
                <span className="text-[12px] font-regular text-secondary-tint-200">10H</span>
                <div className="h-4 w-[1px] bg-secondary mx-4"></div>
                <span className="text-[12px] font-regular text-quaternary">FIRST TEAM</span>
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
      </div>

      {/* Three Bottom Boxes Section */}
      <div className="w-[1300px] mx-auto mt-[34px] flex justify-between">
        {[1, 2, 3].map((index) => (
          <div key={index} className="w-[420px] h-[340px] rounded-lg bg-quinary-tint-800 shadow-[4px_4px_16px_rgba(0,0,0,0.25)] overflow-hidden group cursor-pointer">
            {/* Top Half - Image Section */}
            <div className="h-1/2 relative overflow-hidden">
              <img 
                src="/images/banners/ArticlePicture2.png" 
                alt="News Image" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-2 left-2">
                <div className="h-[1px] w-3 bg-quaternary transition-all duration-300 group-hover:w-[100px]"></div>
              </div>
            </div>
            
            {/* Bottom Half - Content Section */}
            <div className="h-1/2 p-2 flex flex-col">
              <h3 className="text-[20px] font-bold text-secondary mt-[8px]">Report: Wolves 0 United Women 6</h3>
              <p className="text-[14px] font-medium text-secondary-tint-100 mt-2">
                United progressed to the Adobe Women's FA Cup quarter-finals with victory in Shropshire.
              </p>
              
              <div className="mt-auto flex items-center">
                <span className="text-[12px] font-regular text-secondary-tint-200">19H</span>
                <div className="h-4 w-[1px] bg-secondary mx-4"></div>
                <span className="text-[12px] font-regular text-quaternary">WOMEN TEAM</span>
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
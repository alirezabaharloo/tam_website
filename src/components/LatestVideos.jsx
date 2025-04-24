import React from 'react';

const LatestVideos = () => {
  return (
    <>
      <div className="w-[1300px] mx-auto mt-8 flex justify-between items-center">
        <h2 className="text-[48px] font-regular text-secondary">Latest Videos</h2>
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
        {[1, 2].map((index) => (
          <div key={index} className="w-[640px] h-[380px] rounded-lg overflow-hidden relative group cursor-pointer">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src="/images/banners/VideoPicture3.png" 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Top Line */}
            <div className="absolute top-6 left-6">
              <div className="h-[2px] w-[20px] bg-quinary-tint-800 transition-all duration-300 group-hover:w-[200px]"></div>
            </div>

            {/* Top Info */}
            <div className="absolute top-[18px] right-6 flex items-center">
              <span className="text-[14px] font-medium text-quinary-tint-800">10H</span>
              <div className="mx-2 h-4 w-[1px] bg-quinary-tint-800"></div>
              <span className="text-[14px] font-medium text-tertiary-tint-200">FIRST TEAM</span>
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
              <h3 className="text-[32px] font-bold text-quinary-tint-800">Amorim hails Dorgu's debut</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Small Video Boxes */}
      <div className="w-[1300px] mx-auto mt-8 flex justify-between">
        {[1, 2, 3].map((index) => (
          <div key={index} className="w-[420px] h-[220px] rounded-lg overflow-hidden relative group cursor-pointer">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src="/images/banners/VideoPicture4.png" 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Top Line */}
            <div className="absolute top-4 left-4">
              <div className="h-[1px] w-[12px] bg-quinary-tint-800 transition-all duration-300 group-hover:w-[100px]"></div>
            </div>

            {/* Top Info */}
            <div className="absolute top-4 right-4 flex items-center">
              <span className="text-[12px] font-regular text-quinary-tint-800">10H</span>
              <div className="mx-2 h-4 w-[1px] bg-quinary-tint-800"></div>
              <span className="text-[12px] font-regular text-tertiary-tint-200">FIRST TEAM</span>
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
              <h3 className="text-[20px] font-bold text-quinary-tint-800">Amorim hails Dorgu's debut</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LatestVideos; 
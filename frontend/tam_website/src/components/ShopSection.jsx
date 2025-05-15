import React from 'react';

const ShopSection = () => {
  return (
    <div className="w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[500px] mt-8 relative rounded-xl overflow-hidden">
      <img 
        src="/images/banners/ShopBackGround.png" 
        alt="Teams Background" 
        className="w-full h-full object-cover blur-sm"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="absolute top-2 sm:top-6 left-0 right-0">
        <div className="w-full max-w-[1080px] mx-auto flex flex-row justify-between items-center gap-2 px-2 sm:px-4">
          <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-regular text-quinary-tint-800">TAM'S SHOP</h2>
          <a 
            href="#" 
            className="flex items-center gap-1 text-[16px] sm:text-[20px] md:text-[24px] text-quinary-tint-800 hover:text-quinary-tint-200 transition-colors duration-300 no-underline group"
          >
            VIEW ALL
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-quinary-tint-800 group-hover:text-quinary-tint-200 transition-colors duration-300"
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
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-[32px] sm:text-[48px] md:text-[64px] font-bold text-quinary-tint-800 mb-2 sm:mb-4">COMING SOON</h3>
          <p className="text-[14px] sm:text-[18px] md:text-[24px] text-quinary-tint-800">Our shop is under construction. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
};

export default ShopSection; 
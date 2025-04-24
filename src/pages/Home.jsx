import React, { useState, useEffect } from 'react'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, image: "/images/banners/SliderPhoto.jpg" },
    { id: 2, image: "/images/banners/SliderPhoto.jpg" },
    { id: 3, image: "/images/banners/SliderPhoto.jpg" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative mt-4">
      <div className="relative w-[1300px] h-[640px] mx-auto rounded-2xl overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={`slider-${slide.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-quinary-tint-900 shadow-[0_0_12px_rgba(1,22,56,1)]'
                  : 'bg-quinary-tint-900/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Latest News Section */}
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

      {/* News Boxes Section */}
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
                <span className="text-[12px] font-regular text-quaternary">ٌWOMEN TEAM</span>
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

      {/* Second Header Section */}
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

      {/* Video Boxes Section */}
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

      {/* Small Video Boxes Section */}
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
    </div>
  )
}

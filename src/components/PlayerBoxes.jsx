import React, { useState, useEffect } from 'react';

const PlayerBoxes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handlePrevSlide = () => {
      setCurrentSlide(prev => Math.max(0, prev - 1));
    };

    const handleNextSlide = () => {
      setCurrentSlide(prev => Math.min(6, prev + 1));
    };

    document.addEventListener('prevSlide', handlePrevSlide);
    document.addEventListener('nextSlide', handleNextSlide);

    return () => {
      document.removeEventListener('prevSlide', handlePrevSlide);
      document.removeEventListener('nextSlide', handleNextSlide);
    };
  }, []);

  return (
    <div className="w-[1300px] mx-auto mt-6">
      <div className="flex overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 440}px)` }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
            <div 
              key={index} 
              className="relative w-[420px] h-[480px] rounded-lg overflow-hidden group cursor-pointer flex-shrink-0 mr-5 shadow-[4px_4px_16px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-0">
                <img 
                  src="/images/banners/PlayersPicture.png" 
                  alt="Player Image" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[24px] font-regular text-quinary-tint-800">Javad</span>
                  <span className="text-[40px] font-bold text-quinary-tint-800">Satari</span>
                </div>
                <span className="text-[16px] font-medium text-tertiary">Forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerBoxes; 
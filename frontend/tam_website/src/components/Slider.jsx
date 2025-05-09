import React, { useState, useEffect } from 'react';

const Slider = () => {
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
  );
};

export default Slider; 
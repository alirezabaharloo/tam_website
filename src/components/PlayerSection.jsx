import React from 'react';
import PlayerBoxes from './PlayerBoxes';

const PlayerSection = () => {
  return (
    <>
      <div className="w-[1300px] mx-auto mt-8 flex justify-between items-center">
        <div className="flex-1"></div>
        <h2 className="text-[40px] font-bold text-secondary absolute left-1/2 transform -translate-x-1/2">PLAYER</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => document.dispatchEvent(new CustomEvent('prevSlide'))}
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
            onClick={() => document.dispatchEvent(new CustomEvent('nextSlide'))}
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
      <PlayerBoxes />
    </>
  );
};

export default PlayerSection; 
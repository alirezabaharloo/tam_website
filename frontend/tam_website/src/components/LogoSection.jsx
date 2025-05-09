import React from 'react';

const LogoSection = () => {
  return (
    <div className="w-[1300px] mx-auto mt-[16px]">
      <div className="relative flex items-center justify-center">
        <div className="w-[550px] h-[2px] bg-quaternary absolute left-0 top-[136px]"></div>
        <div className="w-[550px] h-[2px] bg-quaternary absolute right-0 top-[136px]"></div>
        <img 
          src="/images/logos/FooterLogo.png" 
          alt="FC TAM Logo" 
          width="124"
          height="243"
          style={{ width: '124px', height: '243px' }}
        />
      </div>
    </div>
  );
};

export default LogoSection; 
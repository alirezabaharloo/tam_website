import React from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToSection } from '../utils/navigation';

const Footer = () => {
  const navigate = useNavigate();
  
  const footerColumns = [
    {
      title: 'Home',
      items: [
        { label: 'Latest News', sectionId: 'latest-news' },
        { label: "Tam's Team", sectionId: 'team-boxes' },
        { label: "Tam's Shop", sectionId: 'shop-section' },
        { label: 'Players', sectionId: 'player-section' }
      ]
    },
    {
      title: "News",
      items: [
        "All Content",
        "Article Content",
        'Video Content',
        'Slideshow Content'
      ]
    },
    {
      title: 'Shop',
      items: [
        "Full Set",
        "Sweater",
        "Backpack",
        "Offers"
      ]
    },
    {
      title: "About",
      items: [
        "Team Name",
        "Team Logo",
        "Team descriptions",
        "Team Honors"
      ]
    }
  ];

  return (
    <div className="w-[1300px] mx-auto mt-[28px]">
      <div className="flex justify-between">
        {footerColumns.map((column, index) => (
          <div key={index} className="flex flex-col">
            <h3 className="text-[24px] font-medium text-secondary mb-[30px]">
              {column.title}
            </h3>
            <div className="flex flex-col gap-[16px]">
              {column.items.map((item, itemIndex) => (
                <span 
                  key={itemIndex} 
                  className="text-[16px] font-normal text-secondary cursor-pointer hover:opacity-80"
                  onClick={() => {
                    if (column.title === 'Home' && item.sectionId) {
                      scrollToSection(item.sectionId, navigate);
                    }
                  }}
                >
                  {column.title === 'Home' ? item.label : item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer; 
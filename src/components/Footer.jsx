import React from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToSection, navigateToNewsWithFilter, scrollToAboutSection } from '../utils/navigation';

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
        { label: "All Content", filter: "all" },
        { label: "Article Content", filter: "basic" },
        { label: "Video Content", filter: "video" },
        { label: "Slideshow Content", filter: "slideshow" }
      ]
    },
    {
      title: 'Shop',
      items: [
        { label: "Coming Soon", path: "/shop" },
        { label: "Coming Soon", path: "/shop" },
        { label: "Coming Soon", path: "/shop" },
        { label: "Coming Soon", path: "/shop" }
      ]
    },
    {
      title: "About",
      items: [
        { label: "Team Name", sectionId: "team-name" },
        { label: "Team Logo", sectionId: "team-descriptions" },
        { label: "Team descriptions", sectionId: "team-descriptions" },
        { label: "Team Honors", sectionId: "team-honors" }
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
                    } else if (column.title === 'News' && item.filter) {
                      navigateToNewsWithFilter(item.filter, navigate);
                    } else if (column.title === 'About' && item.sectionId) {
                      scrollToAboutSection(item.sectionId, navigate);
                    } else if (column.title === 'Shop' && item.path) {
                      navigate(item.path);
                    }
                  }}
                >
                  {item.label}
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
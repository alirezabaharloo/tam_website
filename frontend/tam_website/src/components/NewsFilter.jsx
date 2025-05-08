import React from 'react';

const NewsFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'basic', label: 'Articles' },
    { id: 'video', label: 'Videos' },
    { id: 'slideshow', label: 'Slideshows' }
  ];

  return (
    <div className="w-[1300px] mx-auto relative">
      <div className="flex items-center h-full">
        <nav className="flex space-x-6 ml-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`font-inter text-[24px] leading-6 no-underline transition-all duration-500 ease-in-out relative group ${
                activeFilter === filter.id ? 'text-quaternary' : 'text-secondary hover:text-quaternary'
              }`}
            >
              {filter.label}
              <span className={`absolute -bottom-0 left-0 w-0 h-0.5 transition-all duration-500 ease-in-out ${
                activeFilter === filter.id ? 'w-full bg-quaternary' : 'group-hover:w-full bg-quaternary'
              }`}></span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NewsFilter; 
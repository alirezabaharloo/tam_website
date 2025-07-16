import React, { useState, useEffect } from 'react';
import { AdminIcons } from '../../../data/Icons';

const TeamFilter = ({ search, searchLanguage, onFilterChange, onClearAllFilters }) => {
  const [searchInput, setSearchInput] = useState(search || '');

  // Check if any filters are active
  const hasActiveFilters = search !== '' || searchLanguage !== 'fa';

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange('search', searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange('search', '');
  };

  const handleSearchLanguageChange = (e) => {
    onFilterChange('searchLanguage', e.target.value);
  };

  return (
    <div className="bg-quinary-tint-700 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary mb-2 sm:mb-0">فیلتر تیم‌ها</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAllFilters}
            className="px-4 py-2 bg-quaternary-tint-700 text-secondary rounded-lg hover:bg-quaternary-tint-600 transition-colors duration-200 flex items-center gap-2"
          >
            <AdminIcons.ClearSearch />
            پاک کردن همه فیلترها
          </button>
        )}
      </div>
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search group */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-secondary">جستجو</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="نام تیم را وارد کنید..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="px-3 py-2 pr-4 rounded-lg border border-quinary-tint-400 focus:outline-none focus:ring-2 focus:ring-primary text-right w-full bg-quinary-tint-800 text-primary pl-8"
                dir="rtl"
              />
              {search !== '' && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-quaternary transition-colors duration-200"
                >
                  <AdminIcons.ClearSearch />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-quinary-tint-800 rounded-lg hover:bg-primary-tint-100 transition-colors duration-300 font-medium"
            >
              جستجو
            </button>
          </div>
        </div>
        {/* Language group */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-secondary">زبان جستجو</label>
          <select
            value={searchLanguage}
            onChange={handleSearchLanguageChange}
            className="px-3 py-2 rounded-lg border border-quinary-tint-400 bg-quinary-tint-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary text-right"
            dir="rtl"
          >
            <option value="fa">سرچ فارسی</option>
            <option value="en">سرچ انگلیسی</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default TeamFilter; 
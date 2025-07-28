import React from 'react';
import { useTranslation } from 'react-i18next';

const FilterSummary = ({ contentType, team, search, onClearAllFilters }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  const getContentTypeLabel = (type) => {
    const typeLabels = {
      'TX': t('newsArticles'),
      'VD': t('newsVideos'), 
      'SS': t('newsSlideshows')
    };
    return typeLabels[type] || '';
  };

  const getTeamLabel = (teamName) => {
    const teamLabels = {
      'football': t('football'),
      'basketball': t('basketball'),
      'volleyball': t('volleyball'),
      'tennis': t('tennis'),
      'swimming': t('swimming')
    };
    return teamLabels[teamName] || teamName;
  };

  const hasSearch = search && search.trim();
  const hasContentType = contentType && contentType !== 'all';
  const hasTeam = team && team.trim();

  // Always show a message, even with default values
  const showDefaultMessage = !hasSearch && !hasContentType && !hasTeam;

  const generateMessage = () => {
    if (isRTL) {
      const filters = [];
      
      if (hasContentType && hasTeam) {
        filters.push(`نوع مقاله ${getContentTypeLabel(contentType)} و تیم ${getTeamLabel(team)}`);
      } else if (hasContentType) {
        filters.push(`نوع مقاله ${getContentTypeLabel(contentType)}`);
      } else if (hasTeam) {
        filters.push(`تیم ${getTeamLabel(team)}`);
      }

      if (hasSearch) {
        if (filters.length > 0) {
          return `فیلتر شده بر اساس ${filters.join(' و ')}, جستجو شده بر اساس ${search}`;
        } else {
          return `جستجو شده بر اساس ${search}`;
        }
      } else if (filters.length > 0) {
        return `فیلتر شده بر اساس ${filters.join(' و ')}`;
      } else {
        // Default demo message
        // TODO: برای عدم نمایش پیام پیش‌فرض، این قسمت را کاملاً حذف کنید
        return `نمایش نمونه: فیلتر شده بر اساس نوع مقاله ویدیو و تیم والیبال، جستجو شده بر اساس بازیکن جدید`;
      }
    } else {
      const filters = [];
      
      if (hasContentType && hasTeam) {
        filters.push(`content type: ${getContentTypeLabel(contentType)} and team: ${getTeamLabel(team)}`);
      } else if (hasContentType) {
        filters.push(`content type: ${getContentTypeLabel(contentType)}`);
      } else if (hasTeam) {
        filters.push(`team: ${getTeamLabel(team)}`);
      }

      if (hasSearch) {
        if (filters.length > 0) {
          return `Filtered by ${filters.join(' and ')}, searched for: ${search}`;
        } else {
          return `Searched for: ${search}`;
        }
      } else if (filters.length > 0) {
        return `Filtered by ${filters.join(' and ')}`;
      } else {
        // Default demo message
        // TODO: برای عدم نمایش پیام پیش‌فرض، این قسمت را کاملاً حذف کنید
        return `Demo: Filtered by content type: video and team: volleyball, searched for: new player`;
      }
    }
  };

  const renderHighlightedMessage = () => {
    const message = generateMessage();
    
    if (isRTL) {
      // Persian highlighting
      let highlightedMessage = message;
      
      // Highlight content type
      if (hasContentType) {
        const contentTypeLabel = getContentTypeLabel(contentType);
        highlightedMessage = highlightedMessage.replace(
          new RegExp(contentTypeLabel, 'g'),
          `<span class="text-quaternary font-semibold">${contentTypeLabel}</span>`
        );
      }
      
      // Highlight team
      if (hasTeam) {
        const teamLabel = getTeamLabel(team);
        highlightedMessage = highlightedMessage.replace(
          new RegExp(teamLabel, 'g'),
          `<span class="text-quaternary font-semibold">${teamLabel}</span>`
        );
      }
      
      // Highlight search term
      if (hasSearch) {
        highlightedMessage = highlightedMessage.replace(
          new RegExp(search, 'g'),
          `<span class="text-quaternary font-semibold">${search}</span>`
        );
      }
      
      // Highlight demo values
      // TODO: برای عدم نمایش highlight کلمات demo، این قسمت را کاملاً حذف کنید
      if (!hasContentType && !hasTeam && !hasSearch) {
        highlightedMessage = highlightedMessage
          .replace(/ویدیو/g, '<span class="text-quaternary font-semibold">ویدیو</span>')
          .replace(/والیبال/g, '<span class="text-quaternary font-semibold">والیبال</span>')
          .replace(/بازیکن جدید/g, '<span class="text-quaternary font-semibold">بازیکن جدید</span>');
      }
      
      return highlightedMessage;
    } else {
      // English highlighting
      let highlightedMessage = message;
      
      // Highlight content type
      if (hasContentType) {
        const contentTypeLabel = getContentTypeLabel(contentType);
        highlightedMessage = highlightedMessage.replace(
          new RegExp(contentTypeLabel, 'g'),
          `<span class="text-quaternary font-semibold">${contentTypeLabel}</span>`
        );
      }
      
      // Highlight team
      if (hasTeam) {
        const teamLabel = getTeamLabel(team);
        highlightedMessage = highlightedMessage.replace(
          new RegExp(teamLabel, 'g'),
          `<span class="text-quaternary font-semibold">${teamLabel}</span>`
        );
      }
      
      // Highlight search term
      if (hasSearch) {
        highlightedMessage = highlightedMessage.replace(
          new RegExp(search, 'g'),
          `<span class="text-quaternary font-semibold">${search}</span>`
        );
      }
      
      // Highlight demo values
      // TODO: برای عدم نمایش highlight کلمات demo، این قسمت را کاملاً حذف کنید
      if (!hasContentType && !hasTeam && !hasSearch) {
        highlightedMessage = highlightedMessage
          .replace(/video/g, '<span class="text-quaternary font-semibold">video</span>')
          .replace(/volleyball/g, '<span class="text-quaternary font-semibold">volleyball</span>')
          .replace(/new player/g, '<span class="text-quaternary font-semibold">new player</span>');
      }
      
      return highlightedMessage;
    }
  };

  return (
    <div className="mt-0 mb-6 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p 
          className={`text-gray-600 text-sm font-medium flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
          dangerouslySetInnerHTML={{ __html: renderHighlightedMessage() }}
        />
        {onClearAllFilters && (hasSearch || hasContentType || hasTeam) && (
          <button
            onClick={onClearAllFilters}
            className={`ml-3 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 ${isRTL ? 'mr-3' : 'ml-3'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {isRTL ? 'حذف فیلترها' : 'Clear Filters'}
          </button>
        )}
      </div>
    </div>
  );
  
  // TODO: برای عدم نمایش کامپوننت وقتی هیچ فیلتری فعال نیست، کد بالا را با این کد جایگزین کنید:
  /*
  const message = renderHighlightedMessage();
  if (!message || (!hasSearch && !hasContentType && !hasTeam)) {
    return null;
  }

  return (
    <div className="mt-0 mb-6 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
      <p 
        className={`text-gray-600 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
  */
};

export default FilterSummary; 
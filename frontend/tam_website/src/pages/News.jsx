import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NewsFilter from '../components/NewsFilter'
import NewsBox from '../components/NewsBox'
import useHttp from '../hooks/useHttp'
import SpinLoader from '../components/UI/SpinLoader'
import SomethingWentWrong from '../components/UI/SomethingWentWrong'
import NoArticlesFound from '../components/UI/NoArticlesFound'

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [offset, setOffset] = useState(0);
  const [displayCount, setDisplayCount] = useState(6);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allArticles, setAllArticles] = useState([]);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const backendLimit = 18; // Number of articles to fetch from backend
  const displayLimit = 6; // Number of articles to display at a time

  const {
    isLoading,
    isError,
    data: response,
    sendRequest
  } = useHttp(`http://localhost:8000/api/blog/articles?offset=${offset}&limit=${backendLimit}`);

  // Update allArticles when new data comes from the backend
  useEffect(() => {
    if (response?.articles) {
      if (offset === 0) {
        // If it's the first load, replace all articles
        setAllArticles(response.articles);
      } else {
        // If loading more, append new articles
        setAllArticles(prev => [...prev, ...response.articles]);
      }
    }
  }, [response, offset]);

  const totalCount = response?.total_count || 0;
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle URL filter changes
  useEffect(() => {
    const filterFromUrl = searchParams.get('type');
    if (filterFromUrl && ['all', 'TX', 'VD', 'SS'].includes(filterFromUrl)) {
      setActiveFilter(filterFromUrl);
      setOffset(0);
      setDisplayCount(displayLimit);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [searchParams]);

  const filters = [
    { id: 'all', label: t('newsAll') },
    { id: 'TX', label: t('newsArticles') },
    { id: 'VD', label: t('newsVideos') },
    { id: 'SS', label: t('newsSlideshows') }
  ];

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // If we've shown all articles from current backend fetch
    if (displayCount >= allArticles.length) {
      // If there are more articles to fetch from backend
      if (offset + backendLimit < totalCount) {
        const newOffset = offset + backendLimit;
        setOffset(newOffset);
        await sendRequest();
      }
    }
    // Add delay before increasing display count
    await new Promise(resolve => setTimeout(resolve, 750));
    // Increase display count by displayLimit
    setDisplayCount(prev => prev + displayLimit);
    setIsLoadingMore(false);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setSearchParams({ type: filterId });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show error state
  if (isError) {
    return <SomethingWentWrong />;
  }

  // Show loading state for initial load
  if (isLoading && offset === 0) {
    return <SpinLoader />;
  }

  const filteredNews = activeFilter === 'all' 
    ? allArticles 
    : allArticles.filter(article => article.type === activeFilter);

  // Show only the articles up to displayCount
  const displayedNews = filteredNews.slice(0, displayCount);

  // Check if we have more articles to show
  const hasMoreNews = displayCount < totalCount;

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        <NewsFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {displayedNews.length > 0 && displayedNews.map((article) => (
            <NewsBox key={article.id} {...article} />
          ))}
          {displayedNews.length <= 0 && <NoArticlesFound />}
        </div>
        {hasMoreNews && displayedNews.length > 0 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading || isLoadingMore}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-quinary-tint-800 hover:bg-quinary-tint-700 rounded-lg text-secondary hover:text-quaternary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[16px] sm:text-[18px] md:text-[20px] font-medium">{t('newsLoadMore')}</span>
                </div>
              ) : (
                <span className="text-[16px] sm:text-[18px] md:text-[20px] font-medium">{t('newsLoadMore')}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
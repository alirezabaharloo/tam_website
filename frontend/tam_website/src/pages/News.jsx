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
  const [requestUrl, setRequestUrl] = useState(`http://localhost:8000/api/blog/articles`);
  const [allArticles, setAllArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  const {
    isLoading,
    isError,
    data: response,
    sendRequest
  } = useHttp(requestUrl);

  // Update allArticles when new data comes from the backend
  useEffect(() => {
    if (response?.articles) {
      setAllArticles(prev => [...prev, ...response.articles]);
    }
  }, [response]);

  

  // Update displayed articles whenever allArticles changes
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * 6;
    setDisplayedArticles(allArticles.slice(startIndex, endIndex));
  }, [allArticles, currentPage]);

  const hasNext = response?.next || false;
  const hasMoreToDisplay = displayedArticles.length < allArticles.length;

  // Handle URL filter changes
  useEffect(() => {
    const filterFromUrl = searchParams.get('type');
    if (filterFromUrl && ['all', 'TX', 'VD', 'SS'].includes(filterFromUrl)) {
      setActiveFilter(filterFromUrl);
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
    if (hasMoreToDisplay) {
      // Load more from existing articles
      setCurrentPage(prev => prev + 1);
    } else if (hasNext) {
      // Fetch more articles from backend
      setRequestUrl(response.next);
      setCurrentPage(prev=>prev + 1)
      // The currentPage will be incremented in the useEffect when new articles arrive
    }
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
  if (isLoading && requestUrl === `http://localhost:8000/api/blog/articles`) {
    return <SpinLoader />;
  }

  const filteredNews = activeFilter === 'all' 
    ? displayedArticles 
    : displayedArticles.filter(article => article.type === activeFilter);

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        <NewsFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredNews.length > 0 && filteredNews.map((article) => (
            <NewsBox key={article.id} {...article} />
          ))}
          {filteredNews.length <= 0 && <NoArticlesFound />}
        </div>
        {(hasNext || hasMoreToDisplay) && filteredNews.length > 0 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-quinary-tint-800 hover:bg-quinary-tint-700 rounded-lg text-secondary hover:text-quaternary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
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
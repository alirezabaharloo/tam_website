import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '../../context/SearchContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import NewsFilter from '../../components/blog/NewsFilter'
import NewsBox from '../../components/blog/NewsBox'
import SpinLoader from '../../components/UI/SpinLoader'
import SomethingWentWrong from '../../components/UI/SomethingWentWrong'
import NoArticlesFound from '../../components/UI/NoArticlesFound'
import useHttp from '../../hooks/useHttp'
import domainUrl from '../../utils/api'


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function News() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const [requestUrl, setRequestUrl] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    const typeParam = params.get('type');
    const categoryParam = params.get('category');
    const pageParam = params.get('page');
    const teamParam = params.get('team');

    const searchUrl = new URL(`http://${domainUrl}:8000/api/blog/articles`);
    if (searchParam) {
      searchUrl.searchParams.set('search', searchParam);
    }
    if (typeParam) {
      searchUrl.searchParams.set('type', typeParam);
    }
    if (categoryParam) {
      searchUrl.searchParams.set('category', categoryParam);
    }
    if (teamParam) {
      searchUrl.searchParams.set('team', teamParam);
    }
    if (pageParam) {
      searchUrl.searchParams.set('page', pageParam);
      searchUrl.searchParams.set('fetch-all', 'true');
    }

    return searchUrl.toString();
  });
  const [allArticles, setAllArticles] = useState([]);


  const activeFilter = new URLSearchParams(window.location.search).get("type");
  const searchParam = new URLSearchParams(window.location.search).get("search");
  const categoryParam = new URLSearchParams(window.location.search).get("category");
  const currentPage = new URLSearchParams(window.location.search).get("page") || "1";
  const teamParam = new URLSearchParams(window.location.search).get("team");

  const {
    isLoading,
    isError,
    data: response,
    sendRequest
  } = useHttp(requestUrl, false);

  useEffect(() => {
    if (response?.articles) {
      setAllArticles(prev => [...prev, ...response.articles]);
    }
  }, [response]);


  const hasNext = response?.next || false;

  const handleLoadMore = () => {
    if (hasNext) {
      const nextPage = parseInt(currentPage) + 1;
      const params = new URLSearchParams(window.location.search);
      params.set('page', nextPage.toString());
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      setRequestUrl(response.next);
    }
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    params.delete('category');
    params.delete('page');
    if (params.get('type')) {
      navigate(`/news?type=${params.get('type')}`);
    } else {
      navigate('/news');
    }
    window.location.reload();
    setAllArticles([]);
  };

  const handleFilterChange = (filterId) => {
    const searchUrl = new URL(`http://${domainUrl}:8000/api/blog/articless`);
    const searchParam = new URLSearchParams(window.location.search).get('search');
    const teamParam = new URLSearchParams(window.location.search).get('team');
    
    if (searchParam) {
      searchUrl.searchParams.set('search', searchParam);
    }
    if (teamParam) {
      searchUrl.searchParams.set('team', teamParam);
    }
    if (filterId !== 'all') {
      searchUrl.searchParams.set('type', filterId);
    }
    
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === filterId) {
      return;
    }
    if (filterId !== 'all') {
      params.set('type', filterId);
    } else {
      params.delete('type');
    }
    params.delete('page'); // Reset page when changing filter
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    
    setRequestUrl(searchUrl.toString());
    setAllArticles([]);
  };

  if (isError) {
    return <SomethingWentWrong />;
  }
  
  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        {searchParam && (
          <div className="flex items-center justify-between bg-quaternary mt-[-3rem] backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-quinary-tint-800/20">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-secondary text-sm sm:text-base md:text-lg">
                {t('searchResultsFor')}:
              </span>
              <span className="text-quaternary font-medium text-sm sm:text-base md:text-lg text-white">
                {searchParam}
              </span>
            </div>
            <button
              onClick={handleClearSearch}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-quinary-tint-800 hover:bg-quinary-tint-700 rounded-lg text-secondary hover:text-quaternary transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm sm:text-base">{t('clearSearch')}</span>
            </button>
          </div>
        )}
        
        {teamParam && (
          <div className="flex items-center justify-between bg-quaternary  backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-quinary-tint-800/20">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-secondary text-sm sm:text-base md:text-lg text-">
                {t('categoryFilter') || 'Category'}:
              </span>
              <span className="text-quaternary font-medium text-sm sm:text-base md:text-lg text-white">
                {teamParam}
              </span>
            </div>
            <button
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.delete('team');
                params.delete('page');
                navigate(`/news?${params.toString()}`);
                window.location.reload();
                setAllArticles([]);
              }}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-quinary-tint-800 hover:bg-quinary-tint-700 rounded-lg text-secondary hover:text-quaternary transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm sm:text-base">{t('clearFilter') || 'Clear Filter'}</span>
            </button>
          </div>
        )}
        
        <NewsFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
        {
          (((isLoading || allArticles.length == 0) && response?.detail !== 'no articles found!' && (!requestUrl.includes("page") || (requestUrl.includes("page") && requestUrl.includes("fetch-all"))))) ?  <SpinLoader /> :(
            (response?.detail === 'no articles found!') ? (
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center min-h-[60vh] w-full"
              >
                <NoArticlesFound />
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode="wait">
                  {allArticles.length > 0 && allArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      variants={itemVariants}
                      layout
                    >
                      <NewsBox {...article} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )
          )
        }
        
        {hasNext && allArticles.length > 0 && (
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
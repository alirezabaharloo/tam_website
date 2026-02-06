import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '../../context/SearchContext'
import { useNavigate } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import api from '../../api'
import NewsFilter from '../../components/blog/NewsFilter'
import NewsBox from '../../components/blog/NewsBox'
import SpinLoader from '../../pages/UI/SpinLoader'
import SomethingWentWrong from '../../pages/UI/SomethingWentWrong'
import NoArticlesFound from '../../pages/UI/NoArticlesFound'
import FilterSummary from '../../components/FilterSummary'

export default function News() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  // Read and normalize URL search parameters (source of truth)
  const initialParams = new URLSearchParams(window.location.search);
  const rawTeamParam = initialParams.get('team');

  // Validate teamParam: ensure it's either empty or a string representation of a number
  if (rawTeamParam && isNaN(parseInt(rawTeamParam))) {
    initialParams.delete('team');
    window.history.replaceState({}, '', `${window.location.pathname}?${initialParams.toString()}`);
  }

  const params = new URLSearchParams(window.location.search);
  const activeFilter = params.get('type');
  const searchParam = params.get('search');
  const categoryParam = params.get('category');
  const currentPage = params.get('page') || '1';
  const teamParam = params.get('team');

  const [selectedTeam, setSelectedTeam] = useState(() => {
    const teamFromUrl = new URLSearchParams(window.location.search).get('team');
    // Also validate selectedTeam initial state
    return (teamFromUrl && !isNaN(parseInt(teamFromUrl))) ? teamFromUrl : '';
  });

  const filters = {
    type: activeFilter || '',
    team: teamParam || '',
    search: searchParam || '',
    category: categoryParam || '',
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['articles', filters],
    queryFn: async ({ pageParam = parseInt(currentPage, 10) || 1, queryKey }) => {
      const [, currentFilters] = queryKey;
      const { search, type, category, team } = currentFilters;

      const searchParams = new URLSearchParams();
      if (search) {
        searchParams.set('search', search);
      }
      if (type) {
        searchParams.set('type', type);
      }
      if (category) {
        searchParams.set('category', category);
      }
      if (team) {
        searchParams.set('team', team);
      }

      searchParams.set('page', pageParam.toString());
      searchParams.set('fetch-all', 'true');

      const response = await api.get(`blog/articles?${searchParams.toString()}`);
      return response.data;
    },
    initialPageParam: parseInt(currentPage, 10) || 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      try {
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get('page');
        return nextPage ? Number(nextPage) : undefined;
      } catch {
        return undefined;
      }
    },
  });

  const latestPage = data?.pages?.[data.pages.length - 1];
  const allArticles = latestPage?.articles || [];
  const hasNext = !!latestPage?.next;
  const noArticlesFound = latestPage?.detail === 'no articles found!';

  const handleFilterChange = (filterId, filterType) => {
    const params = new URLSearchParams(window.location.search);

    // Clear category when type or team filter changes (search persists)
    if (filterType === 'type' || filterType === 'team') {
      // params.delete('search'); // REMOVED: Allow search to persist
      params.delete('category');
      // Update searchQuery in context if needed
      // setSearchQuery('');
    }

    if (filterId !== 'all' && filterId !== '') { // Also handle empty string for team filter
      params.set(filterType, filterId);
    } else {
      params.delete(filterType);
    }
    params.delete('page'); // Reset page to 1 when changing filter

    const newSearchParams = params.toString();
    navigate(`${window.location.pathname}?${newSearchParams}`);
  };

  const handleLoadMore = () => {
    if (hasNext && hasNextPage && !isFetchingNextPage) {
      const nextPage = parseInt(currentPage) + 1;
      const params = new URLSearchParams(window.location.search);
      params.set('page', nextPage.toString());
      const newSearchParams = params.toString();
      window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams}`);
      fetchNextPage();
    }
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    params.delete('category');
    params.delete('page'); // Clear page parameter as well

    const typeParamValue = params.get('type');
    if (typeParamValue) {
      navigate(`/news?type=${typeParamValue}`);
    } else {
      navigate('/news');
    }
  };

  const handleClearAllFilters = () => {
    navigate('/news');
    setSelectedTeam('');
  };

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
  };

  const handleApplyTeamFilter = () => {
    handleFilterChange(selectedTeam, 'team');
  };

  if (isError) {
    return <SomethingWentWrong />;
  }
  
  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-4"> 
        
        <NewsFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
          selectedTeam={selectedTeam}
          onTeamChange={handleTeamChange}
          onApplyTeamFilter={handleApplyTeamFilter}
        />
        
        {/* Filter Summary */}
        <FilterSummary 
          contentType={activeFilter} 
          team={teamParam} 
          search={searchParam} 
          onClearAllFilters={handleClearAllFilters}
        />
        {
          (isLoading && !noArticlesFound) ? (
            <SpinLoader />
          ) : (
            noArticlesFound ? (
              <div
                className="flex flex-col items-center justify-center min-h-[60vh] w-full"
              >
                <NoArticlesFound />
              </div>
            ) : (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
              >
                
                  {allArticles.length > 0 && allArticles.map((article) => (
                    <div
                      key={article.id}
                    >
                      <NewsBox {...article} />
                    </div>
                  ))}
                
              </div>
            )
          )
        }
        
        {hasNext && allArticles.length > 0 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-quinary-tint-800 hover:bg-quinary-tint-700 rounded-lg text-secondary hover:text-quaternary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingNextPage ? (
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
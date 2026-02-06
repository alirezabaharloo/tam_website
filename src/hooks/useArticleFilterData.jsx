import { useQuery } from '@tanstack/react-query';
import api from '../api';

// Shared React Query hook to fetch article filter data once and cache it
const useArticleFilterData = () => {
  return useQuery({
    queryKey: ['article-filter-data'],
    queryFn: async () => {
      const response = await api.get('/blog/article-filter-data');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useArticleFilterData;



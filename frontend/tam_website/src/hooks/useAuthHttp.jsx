import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { renderToReadableStream } from 'react-dom/server';

const useAuthHttp = (url, options = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    errorContent: ""
  });
  const [data, setData] = useState([]);
  const { tokens, refreshToken, logout } = useAuth();

  const handleUnauthorized = useCallback(async () => {
    try {
      const newTokens = await refreshToken();
      if (newTokens && newTokens.access) {
        // Update tokens in localStorage and context
        localStorage.setItem('tokens', JSON.stringify({
          access: newTokens.access,
          refresh: newTokens.refresh
        }));
        return true;
      }
    } catch (error) {
      // If refresh token fails, logout the user
      logout();
      return false;
    }
    return false;
  }, [refreshToken, tokens, logout]);

  const customFetchFunction = async (url, options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }) => {
    // Add auth headers to the request
    const requestOptions = {
      ...options,                                         
      headers: {
        ...options?.headers,
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`,
        'Content-Type': 'application/json',
      }
    };
    let res = await fetch(url, requestOptions);
    
    // if (res.status === 401) {
    //   // Try to refresh the token
    //   const refreshSuccess = await handleUnauthorized();
    //   if (refreshSuccess) {
    //     // Retry the original request with new token
    //     const newOptions = {
    //       ...requestOptions,
    //       headers: {
    //         ...requestOptions.headers,
    //         ...getAuthHeader()
    //       }   
    //     };
    //     res = await fetch(url, newOptions);
    //   } else {
    //     throw new Error('Authentication failed');
    //   }
    // }
    
    if (res.status === 401){
      logout();
    }
    
    const resData = await res.json();
    
    if (res.status === 400 && requestOptions.method !== 'GET') {
      return {
        isError: true,
        errorContent: resData
      };
    }
    
    if (!res.ok) { 
      setError({
        isError: true,
        errorContent: resData
      })
    }
    
    return resData;
  };
  
  const sendRequest = useCallback(async (requestData = null) => {
    setIsLoading(true);
    
    try {
      let responseData;
      if (requestData) {
        responseData = await customFetchFunction(url, {...options, body: JSON.stringify(requestData)});
      } else {
        responseData = await customFetchFunction(url, options);
      }
      setData(responseData);
      console.log(responseData);
      
      return responseData      

    } catch (error) {
      setError({
        isError: true,
        errorContent: error.message
      })
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if ((options && options.method === 'GET') || (!options)) {
      sendRequest();
    }
  }, [url, options]);

  return {
    isLoading,
    data,
    sendRequest,
    isError: error.isError,
    errorContent: error.errorContent
  };
};

export default useAuthHttp;
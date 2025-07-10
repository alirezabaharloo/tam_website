import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

const useAdminHttp = (url, options = null) => {
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
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        return true;
      }
    } catch (error) {
      console.log('some error occurd!', error.message);
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
        'Accept-Language': 'en'
      }
    };
    let res = await fetch(url, requestOptions);
    
    
    const resData = await res.json();
    
    console.log(resData);
    
    if (res.status === 401 && resData?.messages[0].message === "Token is expired") {
      // Try to refresh the token
      
      const refreshSuccess = await handleUnauthorized();
      
      if (refreshSuccess) {
        // Retry the original request with new token
        const newOptions = {
          ...requestOptions,
          headers: {
            ...requestOptions.headers,
          }   
        };
        res = await fetch(url, newOptions);
      } else {
        throw new Error('Authentication failed');
      }
    }

    if (res.status === 401 && resData.messages[0].message === "Token is expired") {
      window.location.reload();
    } 

    if (res.status === 401 && resData.messages[0].message === "Token is invalid") {
      logout();
    }

    if (!res.ok) {
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
  
  const sendRequest = useCallback(async (requestUrl = null, requestMethod = null, requestData = null) => {
    setIsLoading(true);
    
    try {
      let responseData;
      if (requestData) {
        responseData = await customFetchFunction(requestUrl, 
          {
            method: requestMethod,
            headers: {
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Accept-Language': 'en',
            },
            body: JSON.stringify(requestData),
          }
        );
      } else if (!requestData && (requestMethod && requestUrl)) {
        responseData = await customFetchFunction(requestUrl, 
          {
            method: requestMethod,
            headers: {
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Accept-Language': 'en'
            },
          }
        );
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
    if (url) {
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

export default useAdminHttp;
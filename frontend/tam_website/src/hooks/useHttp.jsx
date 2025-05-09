import { useState, useCallback, useEffect } from 'react';

const customFetchFunction = async (url, options = {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}) => {
  console.log(options);
  
  const res = await fetch(url, options);
  console.log(res);
  
  const resData = await res.json();

  if (!res.ok) {
    // Handle error messages from the server
    const errorMessage = typeof resData === 'object' 
      ? Object.entries(resData).map(([key, value]) => `${key}: ${value}`).join('\n')
      : resData.toString();
    throw new Error(errorMessage);
  }

  return resData;
};

const useHttp = (url, options = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [data, setData] = useState(null);
  
  const sendRequest = useCallback(async (requestData = null) => {
    setIsLoading(true);
    setIsError(null);
    console.log(requestData);
    
    try {
      let responseData;
      if (requestData) {
        responseData = await customFetchFunction(url, {...options, body: JSON.stringify(requestData)});
        
      } else {
        responseData = await customFetchFunction(url);
      }
      setData(responseData);
    } catch (error) {
      setIsError(error.message);
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }

  }, [url, options]);

  useEffect(()=>{

        
    if ((options && options.method === 'GET') || (!options)) {
      sendRequest();
    } 
  }, [url, options]);

  return {
    isLoading,
    isError,
    data,
    sendRequest
  };
};

export default useHttp;
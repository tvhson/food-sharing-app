// LoadingContext.js

import React, {createContext, useContext, useState} from 'react';

const LoadingContext = createContext({
  loading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({children}: any) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{loading, showLoading, hideLoading}}>
      {children}
    </LoadingContext.Provider>
  );
};

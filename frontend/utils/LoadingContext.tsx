// LoadingContext.js
import dayjs from 'dayjs';
import React, {createContext, useState, useContext} from 'react';

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

export const formatDate = (
  date: string | Date | dayjs.Dayjs,
  format: string = 'DD/MM/YYYY',
): string => {
  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) {
      return '';
    }
    return dayjsDate.format(format);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

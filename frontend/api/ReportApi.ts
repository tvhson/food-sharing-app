import ApiManager from './ApiManager';

export const getReport = async (token: any) => {
  try {
    const response = await ApiManager('reports', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const banAccount = async (userId: any, days: any, token: any) => {
  try {
    const response = await ApiManager('accounts/ban', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      params: {
        userId: userId,
        days: days,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const updateReport = async (reportId: any, token: any, data: any) => {
  try {
    const response = await ApiManager(`reports/${reportId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      data: data,
    });
    return response;
  } catch (error) {
    return error;
  }
};

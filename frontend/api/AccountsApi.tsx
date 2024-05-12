import ApiManager from './ApiManager';

export const getInfoUser = async (token: any) => {
  try {
    const response = await ApiManager('accounts/me', {
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

export const updateUser = async (data: any, token: any) => {
  try {
    const result = await ApiManager('accounts/info', {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      data: data,
    });
    return result;
  } catch (error) {
    return error;
  }
};

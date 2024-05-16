import ApiManager from './ApiManager';
export const register = async (data: any) => {
  try {
    const response = await ApiManager.post('auth/register', data);
    return response;
  } catch (error) {
    throw error;
  }
};

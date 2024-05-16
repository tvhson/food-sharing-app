import ApiManager from './ApiManager';
export const login = async (data: any) => {
  try {
    const response = await ApiManager.post('auth/login', data);
    return response;
  } catch (error) {
    throw error;
  }
};

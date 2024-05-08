import ApiManager from './ApiManager';
export const login = async (data: any) => {
  try {
    const response = await ApiManager.post('api/auth/authenticate', data);
    return response;
  } catch (error) {
    throw error;
  }
};

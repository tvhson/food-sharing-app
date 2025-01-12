import ApiManager from './ApiManager';
export const login = async (data: any) => {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 10000),
    );

    const response = await Promise.race([
      ApiManager.post('auth/login', data),
      timeoutPromise,
    ]);
    return response;
  } catch (error) {
    throw error;
  }
};

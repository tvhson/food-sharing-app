import ApiManager from './ApiManager';
export const login = async (data: any) => {
  try {
    console.log('Before calling login 2');

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 10000),
    );

    const response = await Promise.race([
      ApiManager.post('auth/login', data),
      timeoutPromise,
    ]);
    console.log('After calling login 2');
    return response;
  } catch (error) {
    throw error;
  }
};

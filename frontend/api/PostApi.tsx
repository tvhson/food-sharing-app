import ApiManager from './ApiManager';
export const getPosts = async (token: any) => {
  try {
    const response = await ApiManager('posts', {
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
export const createPost = async (data: any, token: any) => {
  try {
    const result = await ApiManager('posts', {
      method: 'POST',
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

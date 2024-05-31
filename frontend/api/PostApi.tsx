import ApiManager from './ApiManager';
export const getPosts = async (token: any) => {
  try {
    const response = await ApiManager('posts/recommended', {
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
export const getPostOfUser = async (token: any) => {
  try {
    const response = await ApiManager('posts/user', {
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
export const deletePost = async (postId: any, token: any) => {
  try {
    const response = await ApiManager(`posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const updatePost = async (postId: any, data: any, token: any) => {
  try {
    const response = await ApiManager(`posts/${postId}`, {
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
export const reportPost = async (token: any, data: any) => {
  try {
    const response = await ApiManager('reports', {
      method: 'POST',
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

export const getPostById = async (postId: any, token: any) => {
  try {
    const response = await ApiManager(`posts/get/${postId}`, {
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

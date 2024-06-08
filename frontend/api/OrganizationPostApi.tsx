import ApiManager from './ApiManager';
export const getOrganizationPost = async (token: any) => {
  try {
    const response = await ApiManager('organizationposts/recommended', {
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
export const createOrganizationPost = async (data: any, token: any) => {
  try {
    const result = await ApiManager('organizationposts', {
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
export const getOrganizationPostOfUser = async (token: any) => {
  try {
    const response = await ApiManager('organizationposts/get', {
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
export const deleteOrganizationPost = async (postId: any, token: any) => {
  try {
    const response = await ApiManager(`organizationposts/${postId}`, {
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
export const updateOrganizationPost = async (
  postId: any,
  data: any,
  token: any,
) => {
  try {
    const response = await ApiManager(`organizationposts/${postId}`, {
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
export const getOrganizationPostById = async (postId: any, token: any) => {
  try {
    const response = await ApiManager(`organizationposts/get/${postId}`, {
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

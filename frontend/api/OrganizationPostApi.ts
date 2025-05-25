import ApiManager from './ApiManager';
import {IComment} from './PostApi';

export const getOrganizationPost = async (token: string, groupId: number) => {
  try {
    const response = await ApiManager('organizationposts/recommended', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      params: {
        groupId,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const createOrganizationPost = async (data: any, token: string) => {
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
export const attendOrganizationPost = async (postId: any, token: any) => {
  try {
    const response = await ApiManager(`organizationposts/attend/${postId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getCommentByOrganizationPostId = async (
  postId: number,
  token: string,
): Promise<IComment[]> => {
  try {
    const response: any = await ApiManager(
      `organizationposts/${postId}/comments`,
      {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCommentToOrganizationPost = async (
  postId: any,
  data: any,
  token: any,
) => {
  try {
    const response = await ApiManager(`organizationposts/${postId}/comments`, {
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

export const deleteCommentOrganizationPost = async (
  postId: any,
  commentId: any,
  token: any,
) => {
  try {
    const response = await ApiManager(
      `organizationposts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const likeOrganizationComment = async (commentId: any, token: any) => {
  try {
    const response = await ApiManager(
      `organizationposts/lovecmt/${commentId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: token,
        },
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getOrganizationPostByUserId = async (userId: any, token: any) => {
  try {
    const response = await ApiManager(`organizationposts/user/${userId}`, {
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

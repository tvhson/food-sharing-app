import ApiManager from './ApiManager';
import {useQuery} from '@tanstack/react-query';

export interface IGetPostsParams {
  type: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export const getPosts = async (token: string, params: IGetPostsParams) => {
  try {
    const response = await ApiManager('posts/recommended', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      params: params,
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

export const likePost = async (postId: any, token: any) => {
  try {
    const response = await ApiManager(`posts/like/${postId}`, {
      method: 'PATCH',
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export interface IComment {
  id: number;
  avatar: string;
  content: string;
  createdDate: string;
  imageUrl: string | null;
  isLove: boolean;
  loveCount: number;
  postId: number;
  userId: number;
  userName: string;
}

export const getCommentByPostId = async (
  postId: any,
  token: any,
): Promise<IComment[]> => {
  try {
    const response = await ApiManager(`posts/${postId}/comments`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface ICreateCommentToPost {
  content: string;
  imageUrl: string | null;
}

export const createCommentToPost = async (
  postId: number,
  data: ICreateCommentToPost,
  token: string,
) => {
  try {
    const response = await ApiManager(`posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      data: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (
  postId: any,
  commentId: any,
  token: any,
) => {
  try {
    const response = await ApiManager(`posts/${postId}/comments/${commentId}`, {
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

export const likeComment = async (commentId: any, token: any) => {
  try {
    const response = await ApiManager(`posts/lovecmt/${commentId}`, {
      method: 'PATCH',
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getPostOfOther = async (userId: any, token: any) => {
  try {
    const response = await ApiManager(`posts/user/${userId}`, {
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

export const confirmReceiveFood = async (
  postId: any,
  receiverId: number,
  token: any,
) => {
  try {
    const response = await ApiManager('posts/confirm-received', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      params: {
        userId: receiverId,
        postId: postId,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export interface ISearchPostsParams {
  keyword: string;
}

export const searchPosts = async (
  token: string,
  params: ISearchPostsParams,
) => {
  try {
    const response = await ApiManager('posts/search', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      params: params,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const useSearchPosts = (
  token: string,
  params: ISearchPostsParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['search-posts', params.keyword],
    queryFn: () => {
      return searchPosts(token, params);
    },
    enabled: !!token && enabled && !!params.keyword.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

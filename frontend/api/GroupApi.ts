import ApiManager from './ApiManager';

export interface IGetGroupResponse {
  id: number;
  name: string;
  description: string;
  joinType: 'public' | 'private';
  imageUrl: string;
  author: {
    id: number;
    name: string;
    imageUrl: string;
    locationName: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  createdDate: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  members: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
  requests: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
  joined: 'JOINED' | 'REQUESTED' | 'NOT_JOINED';
}

export const getGroup = async (token: string): Promise<IGetGroupResponse[]> => {
  try {
    const response = await ApiManager(`groups/recommended`, {
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

export interface ICreateGroupRequest {
  name: string;
  description: string;
  joinType: 'public' | 'private';
  imageUrl: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  latitude: number;
  longitude: number;
}

export const createGroup = async (
  token: string,
  request: ICreateGroupRequest,
): Promise<IGetGroupResponse> => {
  try {
    const response = await ApiManager(`groups/create`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      data: request,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editGroup = async (
  token: string,
  groupId: number,
  request: ICreateGroupRequest,
): Promise<IGetGroupResponse> => {
  try {
    const response = await ApiManager(`groups/${groupId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      data: request,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGroup = async (token: string, groupId: number) => {
  try {
    await ApiManager(`groups/${groupId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getMyGroup = async (
  token: string,
): Promise<IGetGroupResponse[]> => {
  try {
    const response = await ApiManager(`groups/get-my-groups`, {
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

export interface IGetGroupTodoResponse {
  id: number;
  title: string;
  date: string;
  status: 'pending' | 'completed';
  groupId: number;
}

export const getGroupTodo = async (
  token: string,
  groupId: number,
): Promise<IGetGroupTodoResponse[]> => {
  try {
    const response = await ApiManager(`todos/${groupId}`, {
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

export interface ICreateGroupTodoRequest {
  title: string;
  date: string;
  status: 'pending' | 'completed';
}
export const createGroupTodo = async (
  token: string,
  groupId: number,
  request: ICreateGroupTodoRequest,
): Promise<IGetGroupTodoResponse> => {
  try {
    const response = await ApiManager(`todos/${groupId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      data: request,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGroupTodo = async (token: string, todoId: number) => {
  try {
    await ApiManager(`todos/${todoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateGroupTodo = async (
  token: string,
  todoId: number,
  request: ICreateGroupTodoRequest,
): Promise<IGetGroupTodoResponse> => {
  try {
    const response = await ApiManager(`todos/${todoId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      data: request,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface IGetGroupStatementResponse {
  id: number;
  description: string;
  user: {
    id: number;
    name: string;
    imageUrl: string;
  };
  groupId: number;
}

export const getGroupStatement = async (
  token: string,
  groupId: number,
): Promise<IGetGroupStatementResponse[]> => {
  try {
    const response = await ApiManager(`statements/${groupId}`, {
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

export interface ICreateGroupStatementRequest {
  user: {
    id: number;
  };
  description: string;
}
export const createGroupStatement = async (
  token: string,
  groupId: number,
  request: ICreateGroupStatementRequest,
): Promise<IGetGroupStatementResponse> => {
  try {
    const response = await ApiManager(`statements/${groupId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      data: request,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editGroupStatement = async (
  token: string,
  statementId: number,
  request: ICreateGroupStatementRequest,
): Promise<IGetGroupStatementResponse> => {
  try {
    const response = await ApiManager(`statements/${statementId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      data: request,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGroupStatement = async (
  token: string,
  statementId: number,
) => {
  try {
    await ApiManager(`statements/${statementId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const inviteUser = async (
  token: string,
  groupId: number,
  userId: number,
) => {
  try {
    await ApiManager(`groups/invite/${groupId}/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const kickUser = async (
  token: string,
  groupId: number,
  userId: number,
): Promise<IGetGroupResponse> => {
  try {
    const response = await ApiManager(`groups/kick/${groupId}/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptInvite = async (
  token: string,
  groupId: number,
  userId: number,
): Promise<IGetGroupResponse> => {
  try {
    const response = await ApiManager(`groups/accept/${groupId}/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectInvite = async (
  token: string,
  groupId: number,
  userId: number,
): Promise<IGetGroupResponse> => {
  try {
    const response = await ApiManager(`groups/reject/${groupId}/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinGroup = async (
  token: string,
  groupId: number,
  userId: number,
): Promise<IGetGroupResponse> => {
  try {
    const response = await ApiManager(`groups/join/${groupId}/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const leaveGroup = async (
  token: string,
  groupId: number,
  userId: number,
): Promise<IGetGroupResponse> => {
  try {
    const response = await ApiManager(`groups/leave/${groupId}/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

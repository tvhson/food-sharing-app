import ApiManager from './ApiManager';
import {UserInfo} from '../redux/UserReducer';

export const getInfoUser = async (token: any) => {
  try {
    const response = await ApiManager('accounts/me', {
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

export const updateUser = async (data: any, token: any) => {
  try {
    const result = await ApiManager('accounts/info', {
      method: 'PUT',
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

export const getInfoUserById = async (id: any, token: any) => {
  try {
    const response = await ApiManager(`accounts/info/${id}`, {
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
export const getAllAccounts = async (token: any) => {
  try {
    const response = await ApiManager('accounts/all', {
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

export const changeRoleById = async (id: any, role: any, token: any) => {
  try {
    const response = await ApiManager(`accounts/role/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      params: {
        newRole: role,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getInfoUserByEmail = async (
  email: string,
  token: string,
): Promise<UserInfo> => {
  try {
    const response = await ApiManager(`accounts/email/${email}`, {
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

export const forgotPassword = async (email: string) => {
  try {
    const response = await ApiManager('auth/forgot-password', {
      method: 'POST',
      params: {
        email: email,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await ApiManager('auth/verify-otp', {
      method: 'POST',
      params: {
        email: email,
        otp: otp,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await ApiManager('auth/reset-password', {
      method: 'POST',
      params: {
        email: email,
        newPassword: newPassword,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

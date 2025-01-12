import ApiManager from './ApiManager';

interface IReward {
  rewardName: number;
  rewardDescription: string;
  imageUrl: string;
  pointRequired: number;
  stockQuantity: number;
}

export const getMyPoint = async (token: any) => {
  try {
    const response = await ApiManager('loyalty/points', {
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

export const earnPoint = async (
  data: {point: number; accountId: number},
  token: any,
) => {
  try {
    const response = await ApiManager('loyalty/points/add', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      params: data,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const redeemPoint = async (
  data: {
    point: number;
    rewardId: number;
    location: string;
    phone: string;
  },
  token: any,
) => {
  try {
    const response = await ApiManager('loyalty/redemptions/redeem', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      params: data,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getMyHistoryRedeem = async (token: any) => {
  try {
    const response = await ApiManager('loyalty/redemptions', {
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

export const getRewards = async (token: any) => {
  try {
    const response = await ApiManager('loyalty/rewards', {
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

export const createRewards = async (data: {rewards: IReward[]}, token: any) => {
  try {
    const response = await ApiManager('loyalty/rewards', {
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

export const updateReward = async (
  data: IReward,
  token: any,
  rewardId: number,
) => {
  try {
    const response = await ApiManager(`loyalty/rewards/${rewardId}`, {
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

export const deleteReward = async (rewardId: number, token: any) => {
  try {
    const response = await ApiManager(`loyalty/rewards/${rewardId}`, {
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

export const getAllRedemptions = async (token: any) => {
  try {
    const response = await ApiManager('loyalty/allredemptions', {
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

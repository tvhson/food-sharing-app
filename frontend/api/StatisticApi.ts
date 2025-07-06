import ApiManager from './ApiManager';

export interface IStatisticResponse {
  totalPosts: number;
  totalEvents: number;
  totalAssistedPeople: number;
  topUsers: ITopUser[];
  totalPostsYou: number;
  totalAssistedPeopleYou: number;
}

export interface ITopUser {
  id: number;
  name: string;
  imageUrl: string;
  locationName: string | null;
  latitude: number | null;
  longitude: number | null;
  totalAssistedPeople: number;
  totalPosts: number;
}

export const getStatistics = async (
  token: string,
): Promise<IStatisticResponse> => {
  try {
    const response = await ApiManager('posts/statistical', {
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

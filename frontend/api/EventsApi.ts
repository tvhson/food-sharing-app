import ApiManager from './ApiManager';
import {useQuery} from '@tanstack/react-query';

export interface ICreateEventRequest {
  title: string;
  description: string;
  imageUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
  startDate?: string | null;
  endDate?: string | null;
  startTime: string;
  endTime: string;
  repeatDays?: number[] | null;
}

export interface IGetEventResponse {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  repeatDays?: number[] | null;
  status: 'ONGOING' | 'UPCOMING' | null;
  author: {
    id: number;
    name: string;
    imageUrl: string;
    locationName: string | null;
    latitude: number | null;
    longitude: number | null;
  };
}

export const createEvent = async (
  token: string,
  request: ICreateEventRequest,
): Promise<IGetEventResponse> => {
  try {
    const response = await ApiManager('events/create', {
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

export interface IGetListEventResponse {
  ongoing: IGetEventResponse[];
  upcoming: IGetEventResponse[];
  all: IGetEventResponse[];
}

export const getEvents = async (
  token: string,
  params: {
    latitude?: number;
    longitude?: number;
    distance?: number;
  },
): Promise<IGetListEventResponse> => {
  try {
    const response = await ApiManager('events/recommended', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEventById = async (
  token: string,
  eventId: number,
): Promise<IGetEventResponse> => {
  try {
    const response = await ApiManager(`events/${eventId}`, {
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

export const updateEvent = async (
  token: string,
  eventId: number,
  request: Partial<ICreateEventRequest>,
): Promise<IGetEventResponse> => {
  try {
    const response = await ApiManager(`events/${eventId}`, {
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

export const deleteEvent = async (
  token: string,
  eventId: number,
): Promise<void> => {
  try {
    await ApiManager(`events/${eventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const useEvents = (
  token: string,
  params: {latitude?: number; longitude?: number; distance?: number},
) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => getEvents(token, params),
    enabled: !!token,
  });
};

export const useEventById = (token: string, eventId: number) => {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventById(token, eventId),
    enabled: !!token,
  });
};

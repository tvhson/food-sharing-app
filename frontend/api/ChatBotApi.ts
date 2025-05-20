import ApiManager from './ApiManager';

export interface IChatBotMessage {
  role: 'assistant' | 'user';
  content: string;
  createdDate: string; // ISO date string
}

export type ChatHistory = IChatBotMessage[];

export const getHistoryChat = async (
  token: string,
  userId: number,
): Promise<ChatHistory> => {
  const response = await ApiManager.get('/chats/chatbot/history', {
    headers: {
      Authorization: token,
      userId: userId,
    },
  });
  return response.data;
};

export const sendMessage = async (
  content: string,
  token: string,
  userId: number,
): Promise<IChatBotMessage> => {
  const response = await ApiManager.post(
    '/chats/chatbot',
    {
      content,
    },
    {
      headers: {
        Authorization: token,
        userId: userId,
      },
    },
  );
  return response.data;
};

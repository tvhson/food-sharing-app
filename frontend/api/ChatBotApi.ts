import ApiManager from './ApiManager';

export interface IChatBotMessage {
  role: 'assistant' | 'user';
  content: string;
  createdDate: string; // ISO date string
}

export type ChatHistory = IChatBotMessage[];

export const getHistoryChat = async (token: string): Promise<ChatHistory> => {
  const response = await ApiManager.get('/chats/chatbot/history', {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

export const sendMessage = async (
  content: string,
  token: string,
): Promise<IChatBotMessage> => {
  const response = await ApiManager.post(
    '/chats/chatbot',
    {
      content,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  );
  return response.data;
};

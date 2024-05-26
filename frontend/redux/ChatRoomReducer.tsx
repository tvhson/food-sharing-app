import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface ChatRoom {
  id: number;
  senderId: number;
  recipientId: number;
  senderName: string;
  recipientName: string;
  senderProfilePic: string;
  recipientProfilePic: string;
  senderStatus: string;
  recipientStatus: string;
  status: string;
  lastMessage: string;
  lastMessageCreatedDate: Date;
  lastMessageSenderId: number;
  numberOfUnreadMessages: number;
}

interface ChatRooms {
  chatRooms: ChatRoom[];
  numberOfUnreadMessages: number;
}

const initialState: ChatRooms = {
  chatRooms: [],
  numberOfUnreadMessages: 0,
};
const ChatRoomSlice = createSlice({
  name: 'ChatRoom',
  initialState,
  reducers: {
    pushChatRoom: (state: ChatRooms, action: PayloadAction<ChatRoom>) => {
      const index = state.chatRooms.findIndex(
        chatRoom => chatRoom.id === action.payload.id,
      );
      if (index !== -1) {
        // If chat room already exists, update it
        state.chatRooms[index] = action.payload;
      } else {
        // If chat room does not exist, add it to the beginning of the list
        state.chatRooms.unshift(action.payload);
      }
    },
    setChatRooms: (state: ChatRooms, action: PayloadAction<ChatRoom[]>) => {
      state.chatRooms = action.payload;
    },
  },
});

export const {pushChatRoom, setChatRooms} = ChatRoomSlice.actions;
export default ChatRoomSlice.reducer;

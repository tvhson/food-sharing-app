import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface GroupMessage {
  id: number;
  groupId: number;
  senderId: number;
  content: string;
  createdDate: Date;
  status: string;
  timestamp: Date;
}

interface Member {
  id: number;
  name: string;
  profilePic: string;
}
interface GroupRoom {
  id: number;
  name: string;
  groupPic: string;
  status: string; // UNREAD, READ
  members: Member[];
  lastMessage: string;
  lastMessageCreatedDate: Date;
  lastMessageSenderId: number;
  numberOfUnreadMessages: number;
}
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
    setChatRooms: (
      state: ChatRooms,
      action: PayloadAction<{chatRooms: ChatRoom[]; myId: number}>,
    ) => {
      var numberOfUnreadMessages = 0;
      state.chatRooms = action.payload.chatRooms;
      state.chatRooms.forEach(chatRoom => {
        if (chatRoom.senderId === action.payload.myId) {
          if (chatRoom.senderStatus === 'UNREAD') {
            chatRoom.numberOfUnreadMessages++;
            numberOfUnreadMessages++;
          }
        } else if (chatRoom.recipientId === action.payload.myId) {
          if (chatRoom.recipientStatus === 'UNREAD') {
            chatRoom.numberOfUnreadMessages++;
            numberOfUnreadMessages++;
          }
        }
      });
      state.numberOfUnreadMessages = numberOfUnreadMessages;
    },
    readAllMessageOfRoomChatId: (
      state: ChatRooms,
      action: PayloadAction<number>,
    ) => {
      const index = state.chatRooms.findIndex(
        chatRoom => chatRoom.id === action.payload,
      );
      if (index !== -1) {
        state.chatRooms[index].numberOfUnreadMessages = 0;
      }
    },
    calculateUnreadMessages: (
      state: ChatRooms,
      action: PayloadAction<number>,
    ) => {
      var numberOfUnreadMessages = 0;
      state.chatRooms.forEach(chatRoom => {
        if (chatRoom.senderId === action.payload) {
          if (chatRoom.senderStatus === 'UNREAD') {
            chatRoom.numberOfUnreadMessages++;
            numberOfUnreadMessages++;
          }
        } else if (chatRoom.recipientId === action.payload) {
          if (chatRoom.recipientStatus === 'UNREAD') {
            chatRoom.numberOfUnreadMessages++;
            numberOfUnreadMessages++;
          }
        }
      });
      state.numberOfUnreadMessages = numberOfUnreadMessages;
    },
    clearChatRooms: (state: ChatRooms) => {
      state.chatRooms = [];
      state.numberOfUnreadMessages = 0;
    },
  },
});

export const {
  pushChatRoom,
  setChatRooms,
  readAllMessageOfRoomChatId,
  clearChatRooms,
  calculateUnreadMessages,
} = ChatRoomSlice.actions;
export default ChatRoomSlice.reducer;

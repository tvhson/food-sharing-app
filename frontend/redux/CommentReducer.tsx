import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  userName: string;
  avatar: string;
  createdDate: Date;
  isLove: boolean;
  loveCount: number;
}

interface CommentList {
  comments: Comment[];
}

const initialState: CommentList = {
  comments: [],
};

const CommentSlice = createSlice({
  name: 'Comment',
  initialState,
  reducers: {
    pushComment: (state: CommentList, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
    setComments: (state: CommentList, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },

    deleteComment: (state: CommentList, action: PayloadAction<number>) => {
      state.comments = state.comments.filter(
        comment => comment.id !== action.payload,
      );
    },
    loveComment: (state: CommentList, action: PayloadAction<number>) => {
      state.comments = state.comments.map(comment =>
        comment.id === action.payload
          ? {
              ...comment,
              isLove: !comment.isLove,
              loveCount: comment.loveCount + (comment.isLove ? -1 : 1),
            }
          : comment,
      );
    },
  },
});

export const {pushComment, setComments, deleteComment, loveComment} =
  CommentSlice.actions;
export default CommentSlice.reducer;

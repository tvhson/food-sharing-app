export interface IGroup {
  id: number;
  name: string;
  description: string;
  image: string;
  numberOfMembers: number;
  numberOfRequests: number;
  joinType: 'public' | 'private';
  isJoined: boolean;
  createdById: number;
}

export interface IGroupPost {
  id: number;
  description: string;
  images?: string[];
  createdDate: string;
  updatedAt: string;
  createdById: number;
  createdBy: IUser;
  likeCount: number;
  isLiked: boolean;
}

export interface IUser {
  id: number;
  name: string;
  image: string;
}

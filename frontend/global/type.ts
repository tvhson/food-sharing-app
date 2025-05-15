export interface IGroup {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface IGroupPost {
  id: number;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

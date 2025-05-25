import {IOrganizationPost} from '../redux/OrganizationPostReducer';

export interface IGroupPost {
  accounts: IUser;
  organizationposts: IOrganizationPost;
}

export interface IUser {
  id: number;
  name: string;
  imageUrl: string;
  locationName: string | null;
  latitude: string | null;
  longitude: string | null;
}

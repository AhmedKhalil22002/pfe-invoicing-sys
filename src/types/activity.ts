import { PagedResponse } from './response';

export interface Activity {
  id?: number;
  label?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface CreateActivityDto extends Pick<Activity, 'label' | 'isDeletionRestricted'> {}
export interface UpdateActivityDto
  extends Pick<Activity, 'label' | 'id' | 'isDeletionRestricted'> {}
export interface PagedActivity extends PagedResponse<Activity> {}

import { ACTIVITY_TYPE } from './enums/activity-type';
import { DOCUMENT_TYPE } from './enums/document-type';

export interface DefaultCondition {
  id?: number;
  document_type?: DOCUMENT_TYPE;
  activity_type?: ACTIVITY_TYPE;
  value?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface UpdateDefaultConditionDto {
  id?: number;
  value?: string;
  propagate_changes?: boolean;
}

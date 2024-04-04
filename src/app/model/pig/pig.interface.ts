import { SanitaryActivity } from "../activity/sanitary-activity.interface";
import { GenderPig, StatusPig } from "./pig.enum";

export interface IPig {
  originalValues(pig: IPig, originalValues: any): unknown;
  identifier: string;
  father_id: string;
  mother_id: string;

  date_birth: string;
  date_exit: string;

  status: StatusPig;
  gender: GenderPig;

  activityHistory: { date: string, activity: string, description: string }[];
  weightHistory: { date: string, weight: string }[];

  key?: string;
  editing?: boolean;
}

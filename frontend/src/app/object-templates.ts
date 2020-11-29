export interface InputTemplate {
    id: number;
    name: string;
    inputs: string[];
    buttons: string[];
    servicetouse?: string;
    apiinfo?: LooseObject;
  }
export interface LooseObject {
  [key: string]: any
}
export interface ScheduleRow {
  subject: string;
  course: string;
}
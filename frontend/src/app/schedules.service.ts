import { Injectable } from '@angular/core';
import { ScheduleRow } from './object-templates';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  schedules: ScheduleRow[] = [];

  constructor() { }

  add(subject: string, course: string) {
    this.schedules.push(
      {
        subject: subject,
        course: course
      }
    );
  }

  get(){
    return this.schedules;
  }

  clear() {
    this.schedules = [];
  }
}

import { Component, OnInit } from '@angular/core';
import { SchedulesService } from '../schedules.service'

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

  constructor(public scheduleService: SchedulesService) { }

  ngOnInit(): void {
  }

}

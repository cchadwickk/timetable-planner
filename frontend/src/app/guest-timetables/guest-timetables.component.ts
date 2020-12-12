import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OpenService } from '../open.service';

@Component({
  selector: 'app-guest-timetables',
  templateUrl: './guest-timetables.component.html',
  styleUrls: ['./guest-timetables.component.css']
})
export class GuestTimetablesComponent implements OnInit {

  courseListName: string = "";

  tableObj={
    'Header': "COURSE LIST TIMETABLE",
    'Filter': ['subject','catalog_nbr','className','class_section','ssr_component','start_time','end_time','days'],
    'Unique': 'catalog_nbr'
  }

  constructor(  
    private route: ActivatedRoute,
    public openService: OpenService,
    private location: Location) { }

  ngOnInit(): void {
    this.getCourseListName();
  }
  
  getCourseListName(): void {
    this.courseListName = String(this.route.snapshot.paramMap.get('courseListName'));
    this.tableObj.Header = "COURSE LIST: "+this.courseListName+" TIMETABLE";
    this.openService.courseListTimetables(this.courseListName).subscribe();
  }

}

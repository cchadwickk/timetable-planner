import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    public openService: OpenService) { }

  ngOnInit(): void {
    this.getTimetables();
  }
  
  getTimetables(): void {
    this.courseListName = String(this.route.snapshot.paramMap.get('courseListName'));
    this.tableObj.Header = "COURSE LIST: "+this.courseListName+" TIMETABLE";
    this.openService.courseListTimetables(this.courseListName).subscribe();
  }

}

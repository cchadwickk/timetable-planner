import { Component, OnInit } from '@angular/core';
import { OpenService } from '../open.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})

export class GuestComponent implements OnInit {

  subject: string;
  course: string;
  keyword: string;

  resultHeader: string = "RESULTS";
  resultFilter: string[] = ['subject','catalog_nbr','className','class_section','ssr_component','start_time','end_time','days'];
  resultUnique: string = "catalog_nbr";

  getHeader: string = "PUBLIC COURSE LISTS";
  getFilter: string[] = ['courseListName','creatorName','lastUpdated','noOfCourses'];
  getUnique: string = "courseListName";

  constructor(public openService: OpenService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.publicCourseList();
  }

  mainSearch(): void {
    this.openService.mainSearch({subject:this.subject, course:this.course}).subscribe();
  }

  keywordSearch(): void{
    this.openService.keywordSearch(this.keyword).subscribe();
  }

  publicCourseList(): void{
    this.openService.publicCourseLists().subscribe();
  }
}

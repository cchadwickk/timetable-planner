import { Component, OnInit } from '@angular/core';
import { OpenService } from '../open.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})

export class GuestComponent implements OnInit {

  subject: string;
  course: string;
  keyword: string;

  resultObj ={
    'Header': "RESULTS",
    'Filter': ['subject','catalog_nbr','className','class_section','ssr_component','start_time','end_time','days'],
    'Unique':"catalog_nbr",
    'ExpandHeading':"REVIEWS",
    'ExpandColumn':"reviews",
    'ExpandKey':"reviewDate"
  }

  getObj ={    
    'Header': "PUBLIC COURSE LISTS",
    'Filter': ['courseListName','creatorName','lastUpdated','noOfCourses'],
    'Unique':"courseListName",
    'ExpandHeading':"SUBJECT COURSE COMBINATIONS",
    'ExpandColumn':"listData",
    'ExpandKey':"course",
    'buttons':[{
      'heading': "TIMETABLES",
      'text': "Get",
      'path': "/guest-timetables/|$courseListName",
      'type': "router",
      'position': "main"
    }]}

  constructor(public openService: OpenService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.openService.searchResults=[];    //Empty any previous results
    this.publicCourseList();
  }

  mainSearch(): void {
    this.openService.mainSearch({subject:this.subject, course:this.course}).subscribe();
  }

  keywordSearch(): void{
    if(this.keyword.length<4){
      this.alertService.add("Minimum 4 characters required.");
      return;
    }
    else{
      this.openService.keywordSearch(this.keyword).subscribe();
    }
  }

  publicCourseList(): void{
    this.openService.publicCourseLists().subscribe();
  }
}

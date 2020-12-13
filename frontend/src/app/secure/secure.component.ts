import { Component, OnInit } from '@angular/core';
import { SecureService } from '../secure.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit {

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

  constructor(public openService: OpenService) { }

  ngOnInit(): void {
    this.openService.searchResults=[];    //Empty any previous results
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

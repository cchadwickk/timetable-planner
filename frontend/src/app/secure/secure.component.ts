import { Component, OnInit } from '@angular/core';
import { SecureService } from '../secure.service';
import { OpenService } from '../open.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit {

  subject: string;
  course: string;
  courseListName: string;
  courseListDesc: string = "";
  courseListPrivate: boolean;

  resultObj ={
    'Header': "COURSE SEARCH RESULT",
    'Filter': ['subject','catalog_nbr','className','class_section','ssr_component','start_time','end_time','days'],
    'Unique':"catalog_nbr",
    'ExpandHeading':"REVIEWS",
    'ExpandColumn':"reviews",
    'ExpandKey':"reviewDate"
  }

  listObj ={    
    'Header': "YOUR COURSE LISTS",
    'Filter': ['creatorName','lastUpdated','noOfCourses','private','courseListName'],
    'Unique':"courseListName",
    'ExpandHeading':"SUBJECT COURSE COMBINATIONS",
    'ExpandColumn':"listData",
    'ExpandKey':"course"
    // 'buttons':[{
    //   'heading': "TIMETABLES",
    //   'text': "Get",
    //   'path': "/guest-timetables/|$courseListName",
    //   'type': "router",
    //   'position': "main"
    // }]
  }

  constructor(public openService: OpenService, public secureService: SecureService) { }

  ngOnInit(): void {
    this.openService.searchResults=[];    //Empty any previous results
    this.getCourseList();
  }

  mainSearch(): void {
    this.openService.mainSearch({subject:this.subject, course:this.course}).subscribe();
  }

  getCourseList(): void{
    this.secureService.getCourseLists().subscribe();
  }

  createCourseList(): void{
    this.secureService.createCourseList(this.courseListName, this.courseListPrivate, this.courseListDesc).subscribe();
  }

}

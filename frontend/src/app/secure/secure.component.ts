import { Component, OnInit } from '@angular/core';
import { SecureService } from '../secure.service';
import { OpenService } from '../open.service';
import { LooseObject } from '../object-template';

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
    'ExpandKey':"reviewDate",
    'buttons':[{
      'heading': "OPTION",
      'text': "REVIEW",
      'path': "this.addReview('|$subject|', '|$catalog_nbr|' )",
      'type': "action",
      'position': "main"
    }]
  }

  listObj ={    
    'Header': "YOUR COURSE LISTS",
    'Filter': ['creatorName','lastUpdated','noOfCourses','private','courseListName','courseListDesc'],
    'Unique':"courseListName",
    'ExpandHeading':"SUBJECT COURSE COMBINATIONS",
    'ExpandColumn':"listData",
    'ExpandKey':"course",
    'buttons':[{
      'heading': "-",
      'text': "DELETE",
      'path': "this.delCourseList('|$courseListName|' )",
      'type': "action",
      'position': "main"
    },{
      'heading': "-",
      'text': "EXPAND",
      'path': "/courseList/|$courseListName",
      'type': "router",
      'position': "main"
    }]
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
    this.secureService.createCourseList(this.courseListName, this.courseListPrivate, this.courseListDesc).subscribe(()=>{
      this.getCourseList();
    });
  }

  addReview(subject: string, course: string){
    console.log("Inside addReview");
  }

  delCourseList(courseListName: string){
    if(confirm("Delete course list: "+courseListName+" ?"))
      this.secureService.delCourseList(courseListName).subscribe(()=>{
        this.getCourseList();
      });
  }

  executeButtonAction(eventObj: LooseObject){
    let {rowData, buttonInfo} = eventObj;
    let temp = "";

    let pathstring = buttonInfo.path;
    let pathelements = pathstring.split('|');
    pathelements.forEach(pathelement => {
      if(pathelement[0] == '$')
        temp += rowData[pathelement.slice(1)];
      else
        temp += pathelement;
    });

    console.log("Evaluating: "+temp);
    eval(temp);
  }
}

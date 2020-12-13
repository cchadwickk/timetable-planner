import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenService } from '../open.service';
import { SecureService } from '../secure.service';
import { AuthService } from '../auth.service';
import { LooseObject } from '../object-template';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  subject: string;
  course: string;
  courseListName: string="";

  yearInp={
    visible: false,
    content: "",
    subject: "",
    course: ""
  }

  listObj ={    
    'Header': "COURSE LIST TIMETABLE",
    'Filter': ['subject','catalog_nbr'],
    'Unique':"catalog_nbr",
    'buttons':[{
      'heading': "-",
      'text': "REMOVE",
      'path': "this.removeCourse('|$subject|', '|$catalog_nbr|')",
      'type': "action",
      'position': "main"
    },{
      'heading': "YEAR",
      'text': "EDIT",
      'path': "this.changeYear('|$subject|', '|$catalog_nbr|')",
      'type': "action",
      'position': "main"
    }]
  }

  resultObj ={
    'Header': "COURSE SEARCH RESULT",
    'Filter': ['subject','catalog_nbr','className','class_section','ssr_component','start_time','end_time','days'],
    'Unique':"catalog_nbr",
    'ExpandHeading':"REVIEWS",
    'ExpandColumn':"reviews",
    'ExpandKey':"reviewDate",
    'buttons':[{
      'heading': "-",
      'text': "ADD",
      'path': "this.addCourse('|$subject|', '|$catalog_nbr|' )",
      'type': "action",
      'position': "main"
    }]
  }

  constructor(
    private route: ActivatedRoute, 
    public openService: OpenService, 
    public secureService: SecureService, 
    private authService: AuthService, 
    private router: Router) { }

  ngOnInit(): void {
    if(this.authService.loggedIn==false)      //If not logged in, redirect to about
      this.router.navigate(['/about']);
    this.openService.searchResults=[];    //Empty any previous results 
    this.secureService.listTimetableResults=[]; 
    this.getTimetables();
    this.getCourseList();
  }

  addCourse(subject: string, course: string){
    let body = this.secureService.courseListResults.find(o => o.courseListName === this.courseListName);
    body.listData.forEach(element => {
      if(element.subject==subject&&element.course==course){
        window.prompt("ALREADY ADDED");
        return;
      }
    });
    body.listData.push({subject:subject, course: course});
    this.secureService.updateCourseList(body).subscribe(()=>{
      this.getTimetables();
    });
    console.log("Course added");
  }

  changeYear(subject: string, course: string){
    console.log("Inside changeYear");
  }

  removeCourse(subject: string, course: string){
    let body = this.secureService.courseListResults.find(o => o.courseListName === this.courseListName);  //Get body for courselistname
    body.listData = body.listData.filter(obj => (obj.subject==subject && obj.course==course));            //remove course
    this.secureService.updateCourseList(body).subscribe(()=>{
      this.getTimetables();
    });
    console.log("Course removed");
  }

  mainSearch(): void {
    this.openService.mainSearch({subject:this.subject, course:this.course}).subscribe();
  }

  getTimetables(): void {
    this.courseListName = String(this.route.snapshot.paramMap.get('courseListName'));
    this.listObj.Header = "COURSE LIST: "+this.courseListName+"\n"+this.secureService.getListDesc(this.courseListName);
    this.secureService.getListTimetables(this.courseListName).subscribe(()=>{
      if(this.secureService.listTimetableResults==[]){
        this.listObj.Header += "\n\n No subject course combination yet. Search from left and add."
      }
    });
  }

  getCourseList(): void{
    this.secureService.getCourseLists().subscribe();
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

    eval(temp);
  }
}

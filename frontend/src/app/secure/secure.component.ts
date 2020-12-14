import { Component, OnInit } from '@angular/core';
import { SecureService } from '../secure.service';
import { OpenService } from '../open.service';
import { LooseObject } from '../object-template';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  reviewInp={
    visible: false,
    content: "",
    subject: "",
    course: ""
  }

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
    'Filter': ['creatorName','noOfCourses','private','courseListName'],
    'Unique':"courseListName",
    'ExpandHeading':"SUBJECT COURSE COMBINATIONS",
    'ExpandColumn':"listData",
    'ExpandKey':"course",
    'buttons':[{
      'heading': "PRIVACY",
      'text': "TOGGLE",
      'path': "this.toggleCourseListPrivacy('|$courseListName|')",
      'type': "action",
      'position': "main"
    },{
      'heading': "-",
      'text': "DELETE",
      'path': "this.delCourseList('|$courseListName|' )",
      'type': "action",
      'position': "main"
    },{
      'heading': "-",
      'text': "VIEW",
      'path': "/courseList/|$courseListName",
      'type': "router",
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
    this.route.queryParams.subscribe(params => {  //If redirected from google, try to get profile data to confirm access
      console.log(params['googleLogin']);
      if(params['googleLogin']=='true')
        this.authService.setProfile();
    });
    if(this.authService.loggedIn==false)      //If not logged in, redirect to about
      this.router.navigate(['/about']);
    this.openService.searchResults=[];    //Empty any previous results
    this.getCourseList();                 //Get courselist data
  }

  mainSearch(): void {
    this.openService.mainSearch({subject:this.subject, course:this.course}).subscribe();
  }

  getCourseList(): void{
    this.secureService.getCourseLists().subscribe();
  }

  toggleCourseListPrivacy(courseListName: string){
    let body = this.secureService.retCourseList(courseListName);
    body.private=!body.private;
    this.secureService.updateCourseList(body).subscribe(()=>{
      this.getCourseList();
    });
  }

  createCourseList(): void{
    if(this.courseListDesc=="")
      this.courseListDesc=" ";
    this.secureService.createCourseList(this.courseListName, this.courseListPrivate, this.courseListDesc).subscribe(()=>{
      this.router.navigate(['/courseList/'+this.courseListName]);
    });
  }

  addReview(subject: string, course: string){
    console.log("Inside addReview");
    this.reviewInp["course"]=course;
    this.reviewInp["subject"]=subject;
    this.reviewInp.visible=true;
  }

  submitReview(){
    if(window.confirm("Submit review ?"))
      this.secureService.addReview(this.reviewInp.subject, this.reviewInp.course, this.reviewInp.content).subscribe(()=>{
        window.location.reload();
      })
    else{
      this.reviewInp.visible=false;
      this.reviewInp.content="";
    }
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

    eval(temp);
  }
}

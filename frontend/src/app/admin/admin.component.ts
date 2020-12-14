import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { AuthService } from '../auth.service';
import { LooseObject } from '../object-template';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isDataAvailable:boolean = false;

  usersObj ={
    'Header': "USERS",
    'Filter': ['name','email','course_list_count','email_is_verified','admin','active'],
    'Unique':"email",
    'buttons':[{
      'heading': "ADMIN",
      'text': "Toggle",
      'path': "this.toggleAdmin('|$email|',|$admin|,|$active|)",
      'type': "action",
      'position': "main"
    },{
      'heading': "ACTIVE",
      'text': "Toggle",
      'path': "this.toggleActive('|$email|', |$admin|, |$active| )",
      'type': "action",
      'position': "main"
    }]
  }

  reviewsObj ={    
    'Header': "REVIEWS",
    'Filter': ['subject','catalog_nbr'],
    'Unique':"catalog_nbr",
    'ExpandHeading':"REVIEW DATA",
    'ExpandColumn':"reviews",
    'ExpandKey':"reviewerEmail",
    'buttons':[{
      'heading': "VISIBILITY",
      'text': "TOGGLE",
      'path': "this.toggleReviewVis('|$subject|', '|$catalog_nbr|', '|$reviewerEmail|', |$visible| )",
      'type': "action",
      'position': "inside"
    }]
  }
  
  constructor(public adminService: AdminService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if(this.authService.user==undefined || this.authService.user.admin==false)          //If the current user is not admin, then redirect       
      this.router.navigate(['/about']);
    this.users();
    this.reviews();
    this.isDataAvailable = true;
  }

  reviews(): void{
    this.adminService.getReviews().subscribe();
  }

  users(): void{
    this.adminService.getUsers().subscribe();
  }

  toggleAdmin(email: string, admin: boolean, active: boolean): void{
    admin = !admin;
    this.adminService.updateUser(email, admin, active).subscribe(()=>{
      window.location.reload();
    });
  }

  toggleActive(email: string, admin: boolean, active: boolean): void{
    active = !active;
    this.adminService.updateUser(email, admin, active).subscribe(()=>{
      window.location.reload();
    });
  }

  toggleReviewVis(subject: string, course: string, email: string, visibility: boolean): void{
    visibility = !visibility;
    this.adminService.updateReview(subject, course, email, visibility).subscribe(()=>{
      window.location.reload();
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
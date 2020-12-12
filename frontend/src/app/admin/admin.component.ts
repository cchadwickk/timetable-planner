import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

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
      'path': "/guest-timetables/|$courseListName",
      'type': "router",
      'position': "main"
    },{
      'heading': "ACTIVE",
      'text': "Toggle",
      'path': "/guest-timetables/|$courseListName",
      'type': "router",
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
      'text': "Toggle",
      'path': "/guest-timetables/|$courseListName",
      'type': "router",
      'position': "inside"
    }]
  }
  
  constructor(public adminService: AdminService) { }

  ngOnInit(): void {
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

}

import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() title: string;

  email: string;
  password: string;

  constructor(public authService: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.authService.checkLogin();                //On each render, check if localstorage has user
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe(res => {
      console.log("Logged in");
    },err=>  {
      if(err.status==401)
        this.alertService.add("Wrong email and password");
      if(err.error.message)
        this.alertService.add(err.error.message);
    });
  }

  logout(): void {
    this.authService.logout().subscribe(res => {
      console.log("Logged out");
    })
  }
}

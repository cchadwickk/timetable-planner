import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() title: string;

  email: string;
  password: string;

  constructor(public authService: AuthService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.authService.checkLogin();                //On each render, check if localstorage has user
  }

  checkEmail(email: string){
    const regex = RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    if(regex.test(email))
      return true;
    else
      return false
  }

  login(): void {
    if(!this.password)
      this.alertService.add("Enter the password");
    else if(!this.email)
      this.alertService.add("Enter the email");
    else if(!this.checkEmail(this.email))
      this.alertService.add("Enter a VALID email.");
    else{
      this.authService.login(this.email, this.password).subscribe(res => {
        console.log("Logged in");
        this.password="";
      },err=>  {
        if((err.error.message)&&(err.error.message.includes("Email not verified"))){
          let inp = confirm("Email has not been verfied. Resend verification email ?");
          if(inp){
            this.authService.resendEmail(this.email).subscribe();
          }
        }
        else if(err.error.message)
          this.alertService.add(err.error.message);
        else if(err.status==401)
          this.alertService.add("Wrong email and password");
        this.password="";
      });
    }
  }

  logout(): void {
    this.authService.logout().subscribe(res => {
      console.log("Logged out");
      this.router.navigate(['/about']);
    })
  }
}

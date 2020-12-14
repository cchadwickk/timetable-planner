import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;
  name: string;

  constructor(public authService: AuthService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
  }

  checkEmail(email: string){
    const regex = RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    if(regex.test(email))
      return true;
    else
      return false
  }

  register(): void {
    if(!this.email)
      this.alertService.add("Enter the email");
    else if(!this.password)
      this.alertService.add("Enter the password");
    else if(!this.name)
      this.alertService.add("Enter the name");
    else if(!this.checkEmail(this.email))
      this.alertService.add("Enter a VALID email.");
    else{
      this.authService.register(this.email, this.password, this.name).subscribe(res => {
        console.log("Registered");
        this.router.navigate(['/']);
      },err=>  {
        if(err.error.message)
          this.alertService.add(err.error.message);
      });
    }
  }

}

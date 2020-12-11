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

  register(): void {
    this.authService.register(this.email, this.password, this.name).subscribe(res => {
      console.log("Registered");
      this.router.navigate(['/']);
    },err=>  {
      if(err.error.message)
        this.alertService.add(err.error.message);
    });
  }

}

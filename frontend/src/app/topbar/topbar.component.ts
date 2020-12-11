import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() title: string;

  email: string;
  password: string;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.checkLogin();
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe(res => {
      console.log("Logged in");
    });
  }

  logout(): void {
    this.authService.logout().subscribe(res => {
      console.log("Logged out");
    })
  }
}

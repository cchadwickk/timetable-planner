import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-secure-view',
  templateUrl: './secure-view.component.html',
  styleUrls: ['./secure-view.component.css']
})
export class SecureViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, public authService: AuthService ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params['googleLogin']);
      if(params['googleLogin']=='true')
        this.authService.setProfile();
    });
  }

}

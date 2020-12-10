import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() title: string;

  email: string;
  password: string;

  constructor() { }

  ngOnInit(): void {
  }

}

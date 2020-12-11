import { Component, OnInit } from '@angular/core';
import { OpenService } from '../open.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})

export class GuestComponent implements OnInit {

  subject: string;
  course: string;
  keyword: string;

  resultHeader: string = "RESULTS";
  resultFilter: string[] = ['subject','catalog_nbr','className','class_section','ssr_component','start_time','end_time','days'];

  constructor(public openService: OpenService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
  }

  mainSearch(): void {
    this.openService.mainSearch({subject:this.subject, course:this.course}).subscribe();
  }

  keywordSearch(): void{
    this.openService.keywordSearch(this.keyword).subscribe();
  }
}

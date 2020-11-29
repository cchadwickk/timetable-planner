import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../results.service'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(public resultsService: ResultsService) { }

  ngOnInit(): void {
  }
}

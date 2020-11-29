import { Component, OnInit } from '@angular/core';
import { InputTemplate, LooseObject} from '../object-templates';
import { INPUTDATA } from '../input-data';
import { TimetableService } from '../timetable.service';
import { SchedulesService } from '../schedules.service';
import { ResultsService } from '../results.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  inputdata = INPUTDATA;
  inputtexts: LooseObject = {};

  constructor(private timetableService: TimetableService, private scheduleService: SchedulesService, private resultsService: ResultsService) {                                   
    this.inputdata.forEach(inputblock => {            //Creates an object which has keys for all inputs
      inputblock.inputs.forEach(inputtype => {
        this.inputtexts[inputtype] = '';
      });
    });
  }

  ngOnInit(): void {}

  onClick(input: InputTemplate, button: string): void {
    if(input.servicetouse == 'timetable')
    {
      this.timetableService.executeAPI(input, button, this.inputtexts)
        .subscribe(results=> {
          this.resultsService.add(results);                                     //Push the results to results service
          console.log(results);
        });
    }
    else if(input.servicetouse == 'schedules')                                  //For changing local schedule data
    {
      if(button == 'ADD')
        this.scheduleService.add(this.inputtexts['SubjectCode'], this.inputtexts['CourseCode']);
      else if(button == 'RESET')
        this.scheduleService.clear();
    }
    else
      console.error("Reached ELSE in onClick function");
  }

}

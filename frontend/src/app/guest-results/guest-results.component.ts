import { Component, OnInit, Input } from '@angular/core';
import { LooseObject } from '../object-template';

@Component({
  selector: 'app-guest-results',
  templateUrl: './guest-results.component.html',
  styleUrls: ['./guest-results.component.css']
})
export class GuestResultsComponent implements OnInit {

  @Input() data: LooseObject[];
  @Input() heading: string;
  @Input() keysFilter: string[];
  @Input() uniqueKey: string;
  @Input() expandColumn: string;
  @Input() expandHeading: string;
  @Input() expandKey: string;

  constructor() { }

  ngOnInit(): void {
  }

  filteredKeys(): string[] {                  //Only select keys in data array, which are provided in keysFilter.
    let retval: string[] = [];
    if(!this.keysFilter)
      return Object.keys(this.data[0]);
    for( let item in this.data[0] ){
      if(this.keysFilter.includes(item))
        retval.push(item);
    }
    return retval;
  }

  remainingKeys(): string[]{
    let retval: string[] = [];
    if(!this.keysFilter)
      return Object.keys(this.data[0]);
    for( let item in this.data[0] ){
      if(!this.keysFilter.includes(item)&&item!=this.expandColumn)
        retval.push(item);
    }
    return retval;
  }

  filterKeyLength(): number{
    return this.filteredKeys().length+1;
  }
}

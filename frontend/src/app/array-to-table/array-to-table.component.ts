import { Component, OnInit, Input } from '@angular/core';
import { LooseObject } from '../object-template';

@Component({
  selector: 'app-array-to-table',
  templateUrl: './array-to-table.component.html',
  styleUrls: ['./array-to-table.component.css']
})
export class ArrayToTableComponent implements OnInit {

  @Input() data: LooseObject[];
  @Input() header: string;
  @Input() keysFilter: string[];

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
}

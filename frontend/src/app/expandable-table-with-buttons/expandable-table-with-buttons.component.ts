import { Component, OnInit, Input } from '@angular/core';
import { LooseObject } from '../object-template';

@Component({
  selector: 'app-expandable-table-with-buttons',
  templateUrl: './expandable-table-with-buttons.component.html',
  styleUrls: ['./expandable-table-with-buttons.component.css']
})
export class ExpandableTableWithButtonsComponent implements OnInit {

  @Input() data: LooseObject[];
  @Input() heading: string;
  @Input() keysFilter: string[];
  @Input() uniqueKey: string;
  @Input() expandColumn: string;
  @Input() expandHeading: string;
  @Input() expandKey: string;
  @Input() buttons?: LooseObject[] = [];

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
      if(!this.keysFilter.includes(item) && item!=this.expandColumn)
        retval.push(item);
    }
    return retval;
  }

  filterKeyLength(): number{
    return this.filteredKeys().length+1;
  }

  getButtons(position: string, type: string): LooseObject[]{    //Filter and get buttons based on provided position and type
    const retButtons = this.buttons.filter(item => 
      (item.position==position && item.type==type));
    return retButtons;
  }

  generateLink(rowData: LooseObject, buttonInfo: LooseObject): string{
    let temp = "";
    let pathstring = buttonInfo.path;
    let pathelements = pathstring.split('|');
    pathelements.forEach(pathelement => {
      if(pathelement[0] == '$')
        temp += rowData[pathelement.slice(1)];
      else
        temp += pathelement;
    });
    return temp;
  }
}

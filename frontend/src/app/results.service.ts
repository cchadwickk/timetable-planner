import { Injectable } from '@angular/core';
import { LooseObject } from './object-templates'

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  results: LooseObject[] = [];

  constructor() { }

  add(results: LooseObject[]) {
    this.results = results;
  }

  get(){
    return this.results;
  }

  clear() {
    this.results = [];
  }
}

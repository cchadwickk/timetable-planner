import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public message: string = "";
  constructor() { }

  add(message: string){
    this.message=message;
    setTimeout(() =>{
      this.message="";
    }, 5000);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../environments/environment'
import { tap } from 'rxjs/operators';
import { LooseObject } from './object-template';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = env.baseUrl+'/admin';
  public reviewsResults: LooseObject[] = [];
  public adminResults: LooseObject[] = [];

  constructor(private http: HttpClient, private alertService: AlertService) { }
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getReviews(): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/reviews';
    return this.http.get<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.reviewsResults = res;
        console.log(res);
        this.alertService.add("Reviews fetched");
      })
    );
  }

  getUsers(): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/users';
    return this.http.get<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.adminResults = res;
        console.log(res);
        this.alertService.add("Users fetched");
      })
    );
  }
}

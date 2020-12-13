import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../environments/environment'
import { tap } from 'rxjs/operators';
import { LooseObject } from './object-template';
import { AlertService } from './alert.service';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = env.baseUrl+'/admin';
  public reviewsResults: LooseObject[] = [];
  public userResults: LooseObject[] = [];

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
        this.userResults = res;
        console.log(res);
        this.alertService.add("Users fetched");
      })
    );
  }

  updateReview(subject: string, course: string, email: string, visible: boolean): Observable<LooseObject[]> {
    const body = {
      visible: visible,
      subject: subject,
      email: email,
      course: course
    };

    let apiPath = this.baseUrl+'/review';
    return this.http.put<LooseObject[]>(apiPath, body, this.httpOptions).pipe(
      tap(res => {
        console.log(res);
        this.alertService.add("Review toggled successfully");
      })
    );
  }

  updateUser(email: string, admin: boolean, active: boolean): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/user';
    const body = {
      email: email,
      admin: admin,
      active: active
    }
    return this.http.put<LooseObject[]>(apiPath, body, this.httpOptions).pipe(
      tap(res => {
        console.log(res);
        this.alertService.add("User information toggled");
      })
    );
  }
}

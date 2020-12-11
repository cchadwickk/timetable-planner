import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { env } from '../environments/environment'
import { map, catchError, tap } from 'rxjs/operators';
import { LooseObject } from './object-template';
import { AlertService } from './alert.service';

interface NamedParameters {
  subject?: string, course?: string
}

@Injectable({
  providedIn: 'root'
})
export class OpenService {

  private baseUrl = env.baseUrl+'/open';
  public searchResults: LooseObject[] = [];
  public getResults: LooseObject[] = [];

  constructor(private http: HttpClient, private alertService: AlertService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  mainSearch({subject, course}: NamedParameters): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/search/?';
    if(subject)
      apiPath += 'subject='+subject;
    if(course)
      apiPath += '&course='+course;
    return this.http.get<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.searchResults = res;
        console.log(res);
        this.alertService.add("Search executed");
      })
    );
  }

  keywordSearch(keyword: string): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/searchKeyword/'+keyword;
    return this.http.get<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.searchResults = res;
        this.alertService.add("Keyword search executed");
      })
    );
  }

  publicCourseLists(): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/courseLists';
    return this.http.get<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.getResults = res;
        this.alertService.add("Public Course Lists Fetched");
      })
    )
  }

  courseListTimetables(courseList: string): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/courseListTimetables/'+courseList;
    return this.http.get<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.getResults = res;
        this.alertService.add("Public Course List Timetables Fetched");
      })
    )
  }
}

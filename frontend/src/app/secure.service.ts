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
export class SecureService {

  private baseUrl = env.baseUrl+'/secure';
  public courseListResults: LooseObject[] = [];

  constructor(private http: HttpClient, private alertService: AlertService) { }
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getCourseLists(): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/courseList';
    return this.http.get<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.courseListResults = res;
        console.log(res);
        this.alertService.add("CourseLists fetched");
      })
    );
  }

  createCourseList(courseListName: string, courseListPrivate: boolean, courseListDesc: string): Observable<LooseObject[]> {
    if(courseListDesc===undefined)
      courseListDesc="";

    const body = {
      courseListName: courseListName,
      courseListDesc: courseListDesc,
      private: courseListPrivate
    };

    let apiPath = this.baseUrl+'/courseList';
    return this.http.put<LooseObject[]>(apiPath, body, this.httpOptions).pipe(
      tap(res => {
        console.log(res);
        this.alertService.add("Created courselist successfully.");
      })
    );
  }

}

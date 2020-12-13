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
  public listTimetableResults: LooseObject[] = [];

  constructor(private http: HttpClient, private alertService: AlertService) { }
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  retCourseList(courseListName: string): LooseObject{
    let retval = this.courseListResults.find(o => o.courseListName === courseListName);
    return retval;
  }

  getListDesc(courseListName: string): LooseObject{
    if(this.courseListResults==[]){
      this.getListTimetables(courseListName).subscribe(()=>{
        let retval = this.courseListResults.find(o => o.courseListName === courseListName);
        return retval.courseListDesc;
      });
    }
    else{
      let retval = this.courseListResults.find(o => o.courseListName === courseListName);
      return retval.courseListDesc;
    }
  }

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

  getListTimetables(courseListName: string): Observable<LooseObject[]>{
    let apiPath = this.baseUrl+'/courseListTimetables/'+encodeURIComponent(courseListName);
    return this.http.get<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.listTimetableResults = res;
        if(res.length==0)
          this.listTimetableResults = [{"INFO":"NO"}];
        console.log(res);
        this.alertService.add("List timetables fetched");
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
        this.alertService.add(res['message']);
      })
    );
  }

  updateCourseList(body: LooseObject){
    let apiPath = this.baseUrl+'/courseList';
    return this.http.put<LooseObject[]>(apiPath, body, this.httpOptions).pipe(
      tap(res => {
        console.log(res);
        this.alertService.add(res['message']);
      })
    );
  }


  delCourseList(courseListName: string): Observable<LooseObject[]> {
    let apiPath = this.baseUrl+'/courseList/'+courseListName;
    return this.http.delete<LooseObject[]>(apiPath, this.httpOptions).pipe(
      tap(res => {
        console.log(res);
        this.alertService.add("Deleted courselist successfully.");
      })
    );
  }

  addReview(subject: string, course: string, content: string){
    const body = {
      subject: subject,
      course: course,
      reviewContent: content
    };

    let apiPath = this.baseUrl+'/courseReview';
    return this.http.put<LooseObject[]>(apiPath, body, this.httpOptions).pipe(
      tap(res => {
        console.log(res);
        this.alertService.add("Review posted successfully.");
      })
    );
  }

}

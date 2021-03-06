import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { env } from '../environments/environment'
import { map, catchError, tap } from 'rxjs/operators';
import { LooseObject } from './object-template';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = env.baseUrl+'/auth';
  public user : LooseObject;
  public loggedIn: boolean;

  constructor(private http: HttpClient, private alertService: AlertService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  setData(email: string, admin: string, name: string): void{
    this.loggedIn=true;
    this.user = { 
      email: email,
      admin: admin,
      name: name
    }
    localStorage.setItem('user', JSON.stringify(this.user))
  }

  login(email: string, password: string): Observable<Boolean> {
    let apiPath = this.baseUrl+'/login';
    let body = {
      email: email,
      password: password
    }
    return this.http.post<LooseObject>(apiPath, body, this.httpOptions).pipe(
      map(res => {
        this.setData(res.email, res.admin, res.name);
        this.alertService.add("Logged in successfully")
        return true;
      })
    );
  }

  resendEmail(email: string): Observable<Boolean> {
    let apiPath = this.baseUrl+'/resendEmail';
    let body = {
      email: email
    }
    return this.http.post<LooseObject>(apiPath, body, this.httpOptions).pipe(
      map(res => {
        this.alertService.add("Verification email resent.")
        return true;
      })
    );
  }

  checkLogin(): void{
    this.user = JSON.parse(localStorage.getItem('user'));
    if(this.user==null)
      this.loggedIn=false;
    else
      this.loggedIn=true;
  }

  logout(): Observable<LooseObject>{
    let apiPath = this.baseUrl+"/logout";
    return this.http.get<LooseObject>(apiPath, this.httpOptions).pipe(
      tap(res => {
        this.loggedIn=false;
        localStorage.removeItem('user');
        this.user=null;
        this.alertService.add("Logged out successfully")
      })
    );
  }

  register(email: string, password: string, name: string): Observable<LooseObject> {
    let apiPath = this.baseUrl+'/register';
    let body = {
      email: email,
      password: password,
      name: name
    }
    return this.http.post<LooseObject>(apiPath, body, this.httpOptions).pipe(
      tap(res =>{
        if(res.message)
          this.alertService.add(res.message);
      })
    );
  }

  setProfile(): void{
    let apiPath = this.baseUrl+'/profile';
    this.http.get<LooseObject>(apiPath, this.httpOptions).subscribe(res =>{
        this.setData(res.email, res.admin, res.name);
        this.alertService.add("Logged in successfully")
      });
  }
}

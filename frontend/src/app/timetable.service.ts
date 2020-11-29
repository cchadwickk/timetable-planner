import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InputTemplate, LooseObject} from './object-templates';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SchedulesService } from './schedules.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private baseUrl = 'https://lab4.ece9065.tk/api';

  constructor( private http: HttpClient, private schedules: SchedulesService) { }

  generateApiPath(pathstring, inputtexts): string{        //Parse pathstring and inputtext to generate apistring
    let apiPath = ''+this.baseUrl;
    let pathelements = pathstring.split('-');
    pathelements.forEach(pathelement => {
      if(pathelement[0] == '$')
        apiPath += inputtexts[pathelement.slice(1)];
      else
        apiPath += pathelement;
    });
    return apiPath;
  }

  executeAPI(input: InputTemplate, button: string, inputtexts: LooseObject): Observable<LooseObject[]> {
    let apiinfo = input.apiinfo[button];
    let method = apiinfo['method'];
    let apipath = this.generateApiPath(apiinfo['path'], inputtexts);
    switch(method){
      case 'GET': {
        return this.http.get<LooseObject[]>(apipath).pipe(
          catchError(this.handleError<LooseObject[]>('executeAPI')));
      }
      case 'DELETE': {
        return this.http.delete<LooseObject[]>(apipath);
      }
      case 'PUT': {                         
        if(input.id == 6)                   //If update schedule PUT api, then get body
          return this.http.put<LooseObject[]>(apipath, this.schedules.get(), this.httpOptions);
        else
          console.error("Body-less PUT requested in timetable service");
      }
      case 'POST': {
        return this.http.post<LooseObject[]>(apipath, this.httpOptions);
      }
      default: {
        console.log('INVALID METHOD TYPE IN TIMETABLE SERVICE');
      }
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

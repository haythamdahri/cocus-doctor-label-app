import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Case } from '../models/case';
import { map, retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  private readonly CASES_API_URI = environment.caseApi;
  private httpHeaders: HttpHeaders = new HttpHeaders().append("content-type", "application/json");

  constructor(private http: HttpClient) { }

  getUserCases() {
      return this.http.get<Case[]>(`${this.CASES_API_URI}/api/v1/cases/currentuser`, {headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  deleteCase(id: string) {
    return this.http.delete<void>(`${this.CASES_API_URI}/api/v1/cases/${id}`);
  }

  handleError(error: Error) {
    return throwError(error);
  }

}

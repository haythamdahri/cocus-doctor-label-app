import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Case } from '../models/case';
import { map, retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private readonly CASES_API_URI = environment.caseApi;
  private httpHeaders: HttpHeaders = new HttpHeaders().append(
    'content-type',
    'application/json'
  );

  constructor(private http: HttpClient) {}

  getUserCases() {
    return this.http
      .get<Case[]>(`${this.CASES_API_URI}/api/v1/cases/users/current`, {
        headers: this.httpHeaders,
      })
      .pipe(retry(5), catchError(this.handleError));
  }

  deleteCase(id: string) {
    return this.http.delete<void>(`${this.CASES_API_URI}/api/v1/cases/${id}`);
  }

  getCase(id: string) {
    return this.http
      .get<Case>(`${this.CASES_API_URI}/api/v1/cases/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(retry(5), catchError(this.handleError));
  }

  saveCase(id: string, customerCase: Case) {
    if (id !== '' && id != null) {
      return this.http
        .put<Case>(`${this.CASES_API_URI}/api/v1/cases/${id}`, customerCase, {
          headers: this.httpHeaders,
        })
        .pipe(retry(5), catchError(this.handleError));
    } else {
      return this.http
        .post<Case>(`${this.CASES_API_URI}/api/v1/cases/`, customerCase, {
          headers: this.httpHeaders,
        })
        .pipe(retry(5), catchError(this.handleError));
    }
  }

  handleError(error: Error) {
    return throwError(error);
  }
}

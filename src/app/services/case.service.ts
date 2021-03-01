import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) { }

  getUserCases() {
      return this.http.get<Case[]>(`${this.CASES_API_URI}/user/cases`).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  handleError(error: Error) {
    return throwError(error);
  }

}

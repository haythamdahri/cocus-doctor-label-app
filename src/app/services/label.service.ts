import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Label } from '../models/label';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  private readonly CASES_API_URI = environment.labelApi;
  private httpHeaders: HttpHeaders = new HttpHeaders().append("content-type", "application/json");
  
  constructor(private http: HttpClient) {}

  getLabels() {
      return this.http.get<Label[]>(`${this.CASES_API_URI}/api/v1/labels/`, {headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  deleteLabel(id: string) {
      return this.http.delete<Label[]>(`${this.CASES_API_URI}/api/v1/labels/${id}`);
  }

  getLabel(id: string) {
      return this.http.get<Label>(`${this.CASES_API_URI}/api/v1/labels/${id}`, {headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  saveLabel(id: string, label: Label) {
    if( id !== "" && id != null ) {
      return this.http.put<Label>(`${this.CASES_API_URI}/api/v1/labels/${id}`, label, {headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
    } else {
      return this.http.post<Label>(`${this.CASES_API_URI}/api/v1/labels/`, label, {headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
    }
  }

  handleError(error: Error) {
    return throwError(error);
  }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Label } from '../models/label';
import { Page } from '../pagination/page';
import { Pageable } from '../pagination/pageable';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  private readonly LABELS_API_URI = environment.labelApi;
  private httpHeaders: HttpHeaders = new HttpHeaders().append("content-type", "application/json");
  
  constructor(private http: HttpClient) {}

  getLabels(search: string, pageable: Pageable) {
    const params: HttpParams = new HttpParams().append('search', search)
    .append('page', pageable.pageNumber.toString())
    .append('size', pageable.pageSize.toString()); 
      return this.http.get<Page<Label>>(`${this.LABELS_API_URI}/api/v1/labels/`, 
        { headers: this.httpHeaders, params}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  getAllLabels() {
      return this.http.get<Array<Label>>(`${this.LABELS_API_URI}/api/v1/labels/list/all`, 
        { headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  deleteLabel(id: string) {
      return this.http.delete<void>(`${this.LABELS_API_URI}/api/v1/labels/${id}`);
  }

  getLabel(id: string) {
      return this.http.get<Label>(`${this.LABELS_API_URI}/api/v1/labels/${id}`, {headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  saveLabel(id: string, label: Label) {
    if( id !== "" && id != null ) {
      return this.http.put<Label>(`${this.LABELS_API_URI}/api/v1/labels/${id}`, label, {headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
    } else {
      return this.http.post<Label>(`${this.LABELS_API_URI}/api/v1/labels/`, label, {headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
    }
  }

  handleError(error: Error) {
    return throwError(error);
  }
}

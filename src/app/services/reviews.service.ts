import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Case } from '../models/case';
import { Page } from '../pagination/page';
import { Pageable } from '../pagination/pageable';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  
  private readonly CASES_API_URI = environment.caseApi;
  private httpHeaders: HttpHeaders = new HttpHeaders().append(
    'content-type',
    'application/json'
  );

  constructor(private http: HttpClient) { }

  getUserReviews(label: string, pageable: Pageable) {
    const params: HttpParams = new HttpParams().append('label', label)
    .append('page', pageable.pageNumber.toString())
    .append('size', pageable.pageSize.toString()); 
      return this.http.get<Page<Case>>(`${this.CASES_API_URI}/api/v1/reviews/`, 
        { headers: this.httpHeaders, params}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  getReview(id: string) {
      return this.http.get<Case>(`${this.CASES_API_URI}/api/v1/reviews/${id}`, 
        { headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  getUserFirstUnreviewedReview() {
      return this.http.get<Case>(`${this.CASES_API_URI}/api/v1/reviews/unreviewed/first`, 
        { headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  reviewCase(id: string, labels: string[]) {
      return this.http.post<Case>(`${this.CASES_API_URI}/api/v1/reviews/`, {id, labels},
        { headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  deleteReview(id: string) {
      return this.http.delete<void>(`${this.CASES_API_URI}/api/v1/reviews/${id}`, 
        { headers: this.httpHeaders}).pipe(
        retry(5),
        catchError(this.handleError)
      );
  }

  handleError(error: Error) {
    return throwError(error);
  }

}

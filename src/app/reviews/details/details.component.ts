import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Case } from 'src/app/models/case';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  error: boolean = false;
  review: Case = new Case('', '', [], false);
  private activatedRouteSubscription: Subscription;
  private reviewSubscription: Subscription;

  constructor(private titleService: Title, private reviewsService: ReviewsService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle("COCUS - Review Details");
    // Check Review ID From Route
    this.activatedRouteSubscription = this.route.params.subscribe(
      (params) => {
        if( params?.id != null ) {
            this.getReview(params?.id);
        } else {
          this.loading = false;
          this.error = false;
        }
      }
    );
  }
    
  ngOnDestroy(): void {
    if( this.reviewSubscription != null ) {
      this.reviewSubscription.unsubscribe();
    }
    if( this.activatedRouteSubscription != null ) {
      this.activatedRouteSubscription.unsubscribe();
    }
  }

  getReview(id: string) {
    this.reviewSubscription = this.reviewsService.getReview(id).subscribe(
      (review) => {
        this.review = review;
        this.loading = false;
        this.error = false;
      },
      (err) => {
        this.loading = false;
        this.error = true;
      }
    )
  }

}

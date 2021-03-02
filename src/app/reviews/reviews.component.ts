import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Case } from '../models/case';
import { Label } from '../models/label';
import { Page } from '../pagination/page';
import { CustomPaginationService } from '../pagination/services/custom-pagination.service';
import { LabelService } from '../services/label.service';
import { ReviewsService } from '../services/reviews.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.sass']
})
export class ReviewsComponent implements OnInit, OnDestroy {

    page: Page<Case> = new Page();
    label: string = '';
    loading: boolean = true;
    error: boolean = false;
    labels: Label[] = [];

    private reviewsSubscription: Subscription;
    private deleteReviewSubscription: Subscription;
    private labelsSubscription: Subscription;
  
    constructor(
      private reviewsService: ReviewsService,
      private labelService: LabelService,
      private titleService: Title,
      private paginationService: CustomPaginationService
    ) {}
  
    ngOnInit(): void {
      // Component Title
      this.titleService.setTitle('COCUS - Reviews');
      // Fetch Reviews
      this.fetchReviews();
      // Fetch All Labels
      this.fetchAllLabels();
    }

    fetchAllLabels() {
      this.labelsSubscription = this.labelService.getAllLabels().subscribe(
        (labels) => {
          this.labels = labels;
        }
      );
    }

    onLabelChange(label: string) {
      this.label = label;
      // Reviews Fetch
      this.fetchReviews();
    }
  
    fetchReviews() {
      this.loading = true;
      this.page.content = [];
      this.reviewsSubscription = this.reviewsService.getUserReviews(this.label, this?.page?.pageable).subscribe(
        (page) => {
          this.page = page;
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          this.error = true;
        }
      );
    }
  
    ngOnDestroy(): void {
      if (this.reviewsSubscription != null) {
        this.reviewsSubscription.unsubscribe();
      }
      if (this.deleteReviewSubscription != null) {
        this.deleteReviewSubscription.unsubscribe();
      }
      if (this.labelsSubscription != null) {
        this.labelsSubscription.unsubscribe();
      }
    }
  
    onDeleteReview(id) {
      // User Confirmation
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete the review',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<i class="far fa-check-circle"></i> Yes, delete it!',
        cancelButtonText: '<i class="far fa-times-circle"></i> No, cancel',
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000,
          });
          this.deleteReviewSubscription = this.reviewsService
            .deleteReview(id)
            .subscribe(
              () => {
                Toast.fire({
                  icon: 'success',
                  title: 'Case has been deleted successfully',
                });
                // Reload
                this.fetchReviews();
              },
              () => {
                Toast.fire({
                  icon: 'error',
                  title: 'An error occurred!',
                });
              }
            );
        }
      });
    }
  
    getNextPage(): void {
      this.page.pageable = this.paginationService.getNextPage(this.page);
      this.fetchReviews();
    }
  
    getPreviousPage(): void {
      this.page.pageable = this.paginationService.getPreviousPage(this.page);
      this.fetchReviews();
    }
  
    getPageInNewSize(pageSize: number): void {
      this.page.pageable = this.paginationService.getPageInNewSize(
        this.page,
        pageSize
      );
      this.fetchReviews();
    }
  
}
  
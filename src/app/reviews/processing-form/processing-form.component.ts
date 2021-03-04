import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Case } from 'src/app/models/case';
import { Label } from 'src/app/models/label';
import { LabelService } from 'src/app/services/label.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-processing-form',
  templateUrl: './processing-form.component.html',
  styleUrls: ['./processing-form.component.sass'],
})
export class ProcessingFormComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  error: boolean = false;
  review: Case = new Case('', '', [], false);
  private activatedRouteSubscription: Subscription;
  private reviewSubscription: Subscription;
  private labelsSubscription: Subscription;
  labels: Label[] = [];
  labelsControl: FormControl = new FormControl();

  constructor(
    private titleService: Title,
    private reviewsService: ReviewsService,
    private labelService: LabelService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle('COCUS - Review Details');
    // Check Review ID From Route
    this.activatedRouteSubscription = this.route.params.subscribe((params) => {
      if (params?.id != null) {
        this.getReview(params?.id);
        this.fetchAllLabels();
      } else {
        this.loading = false;
        this.error = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.reviewSubscription != null) {
      this.reviewSubscription.unsubscribe();
    }
    if (this.activatedRouteSubscription != null) {
      this.activatedRouteSubscription.unsubscribe();
    }
    if (this.labelsSubscription != null) {
      this.labelsSubscription.unsubscribe();
    }
  }

  fetchAllLabels() {
    this.labelsSubscription = this.labelService
      .getAllLabels()
      .subscribe((labels) => {
        this.labels = labels;
      });
  }

  getReview(id: string) {
    this.reviewSubscription = this.reviewsService.getReview(id).subscribe(
      (review) => {
        this.review = review;
        this.loading = false;
        this.error = false;
        this.labelsControl.patchValue(review?.conditions?.map(c => c?.id?.toString()));
      },
      (err) => {
        this.loading = false;
        if (err?.status == 404) {
          this.review = null;
        } else {
          this.error = true;
        }
      }
    );
  }

  hasLabelsAssigned(label: Label) {
    return this.review?.conditions?.filter(l => l?.id === label?.id).length > 0;
  }


  saveReview() {
    console.log(this.labelsControl.value)
    this.loading = true;
    this.reviewSubscription = this.reviewsService.reviewCase(this.review?.id, this.labelsControl?.value).subscribe(
      (review) => {
        this.loading = false;
        this.review = review;
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: 'success',
          title: 'Review has been saved successfully',
        });
      },
      (err) => {
        this.loading = false;
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: 'error',
          title: 'An error occured, please try again',
        });
      }
    )
  }
}

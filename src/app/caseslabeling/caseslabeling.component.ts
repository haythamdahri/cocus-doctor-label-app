import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Case } from '../models/case';
import { Label } from '../models/label';
import { LabelService } from '../services/label.service';
import { ReviewsService } from '../services/reviews.service';

@Component({
  selector: 'app-caseslabeling',
  templateUrl: './caseslabeling.component.html',
  styleUrls: ['./caseslabeling.component.sass'],
})
export class CaseslabelingComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  error: boolean = false;
  review: Case = new Case('', '', [], false);
  private reviewSubscription: Subscription;
  private labelsSubscription: Subscription;
  labels: Label[] = [];
  labelsControl: FormControl = new FormControl();

  constructor(
    private titleService: Title,
    private reviewsService: ReviewsService,
    private labelService: LabelService
  ) {}

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle('COCUS - Cases Labeling Details');
    // Check Review ID From Route
    this.getNextUnreviewedReview();
    this.fetchAllLabels();
  }

  ngOnDestroy(): void {
    if (this.reviewSubscription != null) {
      this.reviewSubscription.unsubscribe();
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

  getNextUnreviewedReview() {
    this.reviewSubscription = this.reviewsService
      .getUserFirstUnreviewedReview()
      .subscribe(
        (review) => {
          this.review = review;
          this.loading = false;
          this.error = false;
        },
        (err) => {
          this.loading = false;
          this.error = true;
        }
      );
  }

  saveAndGetNextCase() {
    this.loading = true;
    this.reviewSubscription = this.reviewsService
      .reviewCase(this.review?.id, this.labelsControl?.value)
      .subscribe(
        (review) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            icon: 'success',
            title:
              'Case has been reviewed successfully, you can update review in reviews section',
          });
          this.labelsControl.patchValue('');
          // Fetch next case
          this.getNextUnreviewedReview();
        },
        (err) => {
          this.loading = false;
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            icon: 'error',
            title: 'An error occured, please try again',
          });
        }
      );
  }

  hasLabelsAssigned(label: Label) {
    return this.review?.conditions?.includes(label, 0);
  }

  onLabelChange() {
    console.log(this.labelsControl.value);
  }
}

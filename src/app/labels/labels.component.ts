import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Label } from '../models/label';
import { LabelService } from '../services/label.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.sass'],
})
export class LabelsComponent implements OnInit, OnDestroy {
  
  labels: Label[] = [];
  loading: boolean = true;
  error: boolean = false;
  private labelsSubscription: Subscription;
  private deleteLabelSubscription: Subscription;

  constructor(
    private labelService: LabelService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle('COCUS - Labels');
    // Fetch Labels
    this.fetchLabels();
  }

  fetchLabels() {
    this.loading = true;
    this.labels = [];
    this.labelsSubscription = this.labelService.getLabels().subscribe(
      (labels) => {
        this.labels = labels;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.error = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.labelsSubscription != null) {
      this.labelsSubscription.unsubscribe();
    }
    if (this.deleteLabelSubscription != null) {
      this.deleteLabelSubscription.unsubscribe();
    }
  }

  onDeleteLabel(id) {
    // User Confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete the label',
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
        this.deleteLabelSubscription = this.labelService
          .deleteLabel(id)
          .subscribe(
            () => {
              Toast.fire({
                icon: 'success',
                title: 'Label has been deleted successfully',
              });
              // Reload
              this.fetchLabels();
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
}

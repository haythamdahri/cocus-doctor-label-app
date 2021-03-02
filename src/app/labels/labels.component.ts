import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Label } from '../models/label';
import { LabelService } from '../services/label.service';
import Swal from 'sweetalert2';
import { Page } from '../pagination/page';
import { CustomPaginationService } from '../pagination/services/custom-pagination.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.sass'],
})
export class LabelsComponent implements OnInit, OnDestroy {
  
  page: Page<Label> = new Page();
  loading: boolean = true;
  error: boolean = false;
  search: string = '';
  private labelsSubscription: Subscription;
  private deleteLabelSubscription: Subscription;

  constructor(
    private labelService: LabelService,
    private titleService: Title,
    private paginationService: CustomPaginationService
  ) {}

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle('COCUS - Labels');
    // Fetch Labels
    this.fetchLabels();
  }

  fetchLabels() {
    this.loading = true;
    this.page.content = [];
    this.labelsSubscription = this.labelService.getLabels(this.search, this?.page?.pageable).subscribe(
      (page) => {
        this.page = page;
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

  getNextPage(): void {
    this.page.pageable = this.paginationService.getNextPage(this.page);
    this.fetchLabels();
  }

  getPreviousPage(): void {
    this.page.pageable = this.paginationService.getPreviousPage(this.page);
    this.fetchLabels();
  }

  getPageInNewSize(pageSize: number): void {
    this.page.pageable = this.paginationService.getPageInNewSize(
      this.page,
      pageSize
    );
    this.fetchLabels();
  }

}

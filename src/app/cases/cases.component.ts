import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Case } from '../models/case';
import { Page } from '../pagination/page';
import { CustomPaginationService } from '../pagination/services/custom-pagination.service';
import { CaseService } from '../services/case.service';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.sass']
})
export class CasesComponent implements OnInit, OnDestroy {

  page: Page<Case> = new Page();
  loading: boolean = true;
  error: boolean = false;
  search: string = '';
  unReviewedCasesCounter: number = 0;
  private casesSubscription: Subscription;
  private deleteCaseSubscription: Subscription;
  private unreviewedCasesSubscription: Subscription;

  constructor(
    private caseService: CaseService,
    private titleService: Title,
    private paginationService: CustomPaginationService
  ) {}

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle('COCUS - Cases');
    // Fetch Labels
    this.fetchCases();
    // Fetch Unreviewed Cases
    this.fetchUnreviewedCases();
  }

  fetchUnreviewedCases() {
    this.unreviewedCasesSubscription = this.caseService.getUnreviewedCase().subscribe(
      (response) => {
        this.unReviewedCasesCounter = response.unreviewedCases;
      }
    );
  }

  fetchCases() {
    this.loading = true;
    this.page.content = [];
    this.casesSubscription = this.caseService.getUserCases(this.search, this?.page?.pageable).subscribe(
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
    if (this.casesSubscription != null) {
      this.casesSubscription.unsubscribe();
    }
    if (this.deleteCaseSubscription != null) {
      this.deleteCaseSubscription.unsubscribe();
    }
    if (this.unreviewedCasesSubscription != null) {
      this.unreviewedCasesSubscription.unsubscribe();
    }
  }

  onDeleteCase(id) {
    // User Confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete the case',
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
        this.deleteCaseSubscription = this.caseService
          .deleteCase(id)
          .subscribe(
            () => {
              Toast.fire({
                icon: 'success',
                title: 'Case has been deleted successfully',
              });
              // Reload
              this.fetchCases();
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
    this.fetchCases();
  }

  getPreviousPage(): void {
    this.page.pageable = this.paginationService.getPreviousPage(this.page);
    this.fetchCases();
  }

  getPageInNewSize(pageSize: number): void {
    this.page.pageable = this.paginationService.getPageInNewSize(
      this.page,
      pageSize
    );
    this.fetchCases();
  }

}

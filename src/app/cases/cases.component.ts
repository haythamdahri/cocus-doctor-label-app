import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Case } from '../models/case';
import { CaseService } from '../services/case.service';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.sass']
})
export class CasesComponent implements OnInit, OnDestroy {

  cases: Case[] = [];
  casesToReview: Case[] = [];
  loading: boolean = true;
  error: boolean = false;
  private casesSubscription: Subscription;
  private deleteCaseSubscription: Subscription;

  constructor(
    private caseService: CaseService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle('COCUS - Cases');
    // Fetch Labels
    this.fetchCases();
  }

  fetchCases() {
    this.loading = true;
    this.cases = [];
    this.casesSubscription = this.caseService.getUserCases().subscribe(
      (cases) => {
        this.cases = cases;
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
}

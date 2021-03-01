import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Case } from '../models/case';
import { CaseService } from '../services/case.service';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.sass']
})
export class CasesComponent implements OnInit, OnDestroy {

  cases: Case[] = [];
  loading: boolean = true;
  error: boolean = false;
  private casesSubscription: Subscription;

  constructor(private caseService: CaseService) { }

  ngOnInit(): void {
    // Fetch User Cases
    this.casesSubscription = this.caseService.getUserCases().subscribe(
      cases => {
        this.cases = cases;
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.error = false;
      }
    );
  }

  ngOnDestroy(): void {
    if( this.casesSubscription != null ) {
      this.casesSubscription.unsubscribe();
    }
  }

}

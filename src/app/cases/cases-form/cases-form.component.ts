import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Case } from 'src/app/models/case';
import { CaseService } from 'src/app/services/case.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cases-form',
  templateUrl: './cases-form.component.html',
  styleUrls: ['./cases-form.component.sass']
})
export class CasesFormComponent implements OnInit {

  form: FormGroup;
  activatedRouteSubscription: Subscription;
  caseSubscription: Subscription;
  loading: boolean = true;
  error: boolean = false;
  customerCase: Case = new Case('', '', false);

  constructor(private titleService: Title, private caseService: CaseService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle("COCUS - Case Form");
    // Form
    this.form = new FormGroup({
      content: new FormControl('', [
        Validators.minLength(25),
        Validators.maxLength(3560),
        Validators.required
      ])
    });
    // Check Case ID From Route
    this.activatedRouteSubscription = this.route.params.subscribe(
      (params) => {
        if( params?.id != null ) {
            this.getCase(params?.id);
        } else {
          this.loading = false;
          this.error = false;
        }
      }
    );
  }

  getCase(id: string) {
    this.caseSubscription = this.caseService.getCase(id).subscribe(
      (customerCase) => {
        this.customerCase = customerCase;
        this.loading = false;
        this.error = false;
        // Set Form Value
        this.form.patchValue({content: customerCase?.content});
      },
      (err) => {
        this.loading = false;
        this.error = true;
      }
    )
  }

  ngOnDestroy(): void {
    if( this.activatedRouteSubscription != null ) {
      this.activatedRouteSubscription.unsubscribe();
    }
    if( this.caseSubscription != null ) {
      this.caseSubscription.unsubscribe();
    }
  }

  onCaseSave() {
    // Check Form Validity
    if( this.form.invalid ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please check your input!',
        confirmButtonText: '<i class="fas fa-check"></i> OK'
      })
      return;
    } 
    this.loading = true;
    this.caseSubscription = this.caseService.saveCase(this.customerCase?.id, this.customerCase).subscribe(
      (customerCase) => {
        // Set Form Value
        this.form.patchValue({content: customerCase?.content});
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: 'success',
          title: 'Case has been saved successfully',
        });
        // Check If New Case Then Redirect
        if( this.customerCase.id === '' || this.customerCase.id === null ) {
          this.router.navigateByUrl(`/cases/save/${customerCase?.id}`);
          return;
        }
        this.customerCase = customerCase;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err?.error?.message ? err?.error?.message : 'An error occurred while saving case!',
          confirmButtonText: '<i class="fas fa-check"></i> OK'
        })
        this.loading = false;
      }
    )
  }

}

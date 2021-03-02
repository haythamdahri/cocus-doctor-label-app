import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Label } from 'src/app/models/label';
import { LabelService } from 'src/app/services/label.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-labels-form',
  templateUrl: './labels-form.component.html',
  styleUrls: ['./labels-form.component.sass']
})
export class LabelsFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  activatedRouteSubscription: Subscription;
  labelSubscription: Subscription;
  loading: boolean = true;
  error: boolean = false;
  label: Label = new Label('', '');

  constructor(private titleService: Title, private labelService: LabelService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Component Title
    this.titleService.setTitle("COCUS - Label Form");
    // Form
    this.form = new FormGroup({
      description: new FormControl('', [
        Validators.minLength(25),
        Validators.maxLength(800),
        Validators.required
      ])
    });
    // Check Label ID From Route
    this.activatedRouteSubscription = this.route.params.subscribe(
      (params) => {
        if( params?.id != null ) {
            this.getLabel(params?.id);
        } else {
          this.loading = false;
          this.error = false;
        }
      }
    );
  }

  getLabel(id: string) {
    this.labelSubscription = this.labelService.getLabel(id).subscribe(
      (label) => {
        this.label = label;
        this.loading = false;
        this.error = false;
        // Set Form Value
        this.form.patchValue({description: label?.description});
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
    if( this.labelSubscription != null ) {
      this.labelSubscription.unsubscribe();
    }
  }

  onLabelSave() {
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
    this.labelSubscription = this.labelService.saveLabel(this.label?.id, this.label).subscribe(
      (label) => {
        // Set Form Value
        this.form.patchValue({description: label?.description});
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: 'success',
          title: 'Label has been saved successfully',
        });
        // Check If New Label Then Redirect
        if( this.label.id === '' || this.label.id === null ) {
          this.router.navigateByUrl(`/labels/save/${label?.id}`);
          return;
        }
        this.label = label;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err?.error?.message ? err?.error?.message : 'An error occurred while saving label!',
          confirmButtonText: '<i class="fas fa-check"></i> OK'
        })
        this.loading = false;
      }
    )
  }

}

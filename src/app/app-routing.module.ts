import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasesFormComponent } from './cases/cases-form/cases-form.component';
import { CasesComponent } from './cases/cases.component';
import { HomeComponent } from './home/home.component';
import { LabelsFormComponent } from './labels/labels-form/labels-form.component';
import { LabelsComponent } from './labels/labels.component';
import { DetailsComponent } from './reviews/details/details.component';
import { ProcessingFormComponent } from './reviews/processing-form/processing-form.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { AuthGuardService } from './services/auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      { path: '', component: HomeComponent },
      { path: 'cases', component: CasesComponent },
      { path: 'labels', component: LabelsComponent },
      { path: 'labels/save', component: LabelsFormComponent },
      { path: 'labels/save/:id', component: LabelsFormComponent },
      { path: 'cases/save', component: CasesFormComponent },
      { path: 'cases/save/:id', component: CasesFormComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'reviews/:id', component: DetailsComponent },
      { path: 'reviews/:id/process', component: ProcessingFormComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

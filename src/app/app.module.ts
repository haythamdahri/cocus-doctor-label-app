import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CasesComponent } from './cases/cases.component';
import initializeKeycloak from './services/auth/init-keycloak';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { LabelsComponent } from './labels/labels.component';
import { LabelsFormComponent } from './labels/labels-form/labels-form.component';
import { CasesFormComponent } from './cases/cases-form/cases-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CustomPaginationComponent } from "./pagination/components/custom-pagination/custom-pagination.component";
import { ReviewsComponent } from './reviews/reviews.component';
import { DetailsComponent } from './reviews/details/details.component';
import { ProcessingFormComponent } from './reviews/processing-form/processing-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    CasesComponent,
    LabelsComponent,
    LabelsFormComponent,
    CasesFormComponent,
    CustomPaginationComponent,
    ReviewsComponent,
    DetailsComponent,
    ProcessingFormComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

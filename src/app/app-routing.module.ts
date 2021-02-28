import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasesComponent } from './cases/cases.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path : '', component: HomeComponent},
  {path : 'cases', component: CasesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

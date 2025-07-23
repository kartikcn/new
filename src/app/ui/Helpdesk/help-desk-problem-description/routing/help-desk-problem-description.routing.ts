import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpDeskProblemDescriptionComponent } from '../modal/help-desk-problem-description.component';

const routes: Routes = [
  { path: '', component:  HelpDeskProblemDescriptionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpDeskProblemDescriptionRoutingModule { }

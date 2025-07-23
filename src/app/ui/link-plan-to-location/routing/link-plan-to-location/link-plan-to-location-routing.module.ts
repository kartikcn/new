import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkPlanToLocationComponent } from '../../modal/link-plan-to-location.component';

const routes: Routes = [
  { path: '', component: LinkPlanToLocationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkPlanToLocationRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkTeamsComponent } from '../modal/work-teams.component';

const routes: Routes = [
  { path: '', component: WorkTeamsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkTeamsRoutingModule { }

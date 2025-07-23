import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpTeamsComponent } from '../emp-teams.component';


const routes: Routes = [
  { path: '', component: EmpTeamsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpTeamsRoutingModule { }

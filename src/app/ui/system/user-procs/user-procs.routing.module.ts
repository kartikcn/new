import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProcsComponent } from './modal/user-procs.component';


const routes: Routes = [
  { path: '', component: UserProcsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProcsRoutingModule { }

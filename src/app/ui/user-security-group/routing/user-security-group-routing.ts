import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSecurityGroupComponent } from '../modal/user-security-group.component';

const routes: Routes = [
  { path: '', component: UserSecurityGroupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSgRoutingModule { }

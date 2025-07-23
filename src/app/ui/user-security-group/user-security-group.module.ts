import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSecurityGroupComponent } from './modal/user-security-group.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RolesListModule } from '../system/roles/widget/roles-list/roles-list.module';
import { UserSgRoutingModule } from './routing/user-security-group-routing';
import { UserListModule } from './widgets/user-list/user-list.module';
import { AssignSecurityGroupModule } from './widgets/assign-security-group/assign-security-group.module';
import { UnAssignSecurityGroupModule } from './widgets/un-assign-security-group/un-assign-security-group.module';



@NgModule({
  declarations: [
    UserSecurityGroupComponent
  ],
  imports: [
    CommonModule,
    RolesListModule,
    UserListModule,
    PrimeNGModule,
    UserSgRoutingModule,
    AssignSecurityGroupModule,
    UnAssignSecurityGroupModule
  ]
})
export class UserSecurityGroupModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProcsComponent } from './user-procs.component';
import { RolesListModule } from '../../roles/widget/roles-list/roles-list.module';
import { UserProcsRoutingModule } from '../user-procs.routing.module';
import { UserUnassignScreensModule } from '../widgets/user-unassign-screens/user-unassign-screens.module';
import { UserAssignScreensModule } from '../widgets/user-assign-screens/user-assign-screens.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    UserProcsComponent
  ],
  imports: [
    CommonModule,
    RolesListModule,
    UserProcsRoutingModule,
    UserUnassignScreensModule,
    UserAssignScreensModule,
    PrimeNGModule
  ]
})
export class UserProcsModule { }

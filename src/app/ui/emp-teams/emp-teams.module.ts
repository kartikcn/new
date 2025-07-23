import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { EmpTeamsComponent } from './emp-teams.component';
import { EmpTeamsRoutingModule } from './routing/emp-teams.routing';
import { EmListModule } from '../Helpdesk/work-teams/widgets/em-list/em-list.module';
import { AssignTeamsModule } from '../Helpdesk/work-teams/widgets/assign-teams/assign-teams.module';
import { UnAssignTeamsModule } from '../Helpdesk/work-teams/widgets/un-assign-teams/un-assign-teams.module';



@NgModule({
  declarations: [
    EmpTeamsComponent,
    
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    EmpTeamsRoutingModule,
    EmListModule,
    AssignTeamsModule,
    UnAssignTeamsModule
  ]
})
export class EmpTeamsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkTeamsComponent } from './modal/work-teams.component';
import { WorkTeamsRoutingModule } from './routing/work-teams.routing';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { EmListModule } from './widgets/em-list/em-list.module';
import { CfListModule } from './widgets/cf-list/cf-list.module';
import { AssignTeamsModule } from './widgets/assign-teams/assign-teams.module';
import { UnAssignTeamsModule } from './widgets/un-assign-teams/un-assign-teams.module';


@NgModule({
  declarations: [
    WorkTeamsComponent,
    
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    WorkTeamsRoutingModule,
    EmListModule,
    CfListModule,
    AssignTeamsModule,
    UnAssignTeamsModule
  ]
})
export class WorkTeamsModule { }

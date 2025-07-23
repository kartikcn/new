import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignTeamsComponent } from './assign-teams.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    AssignTeamsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    MatTooltipModule
  ],
  exports: [AssignTeamsComponent]
})
export class AssignTeamsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnAssignTeamsComponent } from './un-assign-teams.component';
import { ConfirmationService } from 'primeng/api';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    UnAssignTeamsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    MatTooltipModule
  ],
  providers: [ ConfirmationService
  ],
  exports: [UnAssignTeamsComponent]
})
export class UnAssignTeamsModule { }

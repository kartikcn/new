import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpmRequestsConsoleComponent } from './Modal/ppm-requests-console.component';
import { PPMRequestConsoleRoutingModule } from './routing/ppm-request-console-routing';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ViewEditWorkRequestModule } from '../Helpdesk/work-request/view-edit-work-request/view-edit-work-request.module';



@NgModule({
  declarations: [
    PpmRequestsConsoleComponent
  ],
  imports: [
    CommonModule,
    PPMRequestConsoleRoutingModule,
    PrimeNGModule,
    ViewEditWorkRequestModule
  ]
})
export class PpmRequestsConsoleModule { }

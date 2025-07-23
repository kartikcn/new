import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpmScheduleTypeListComponent } from './ppm-schedule-type-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PpmScheduleDetailsRoutingModule } from '../../routing/ppm-schedule-details-routing';
import { PpmScheduleTypeModule } from '../ppm-schedule-type/ppm-schedule-type.module';



@NgModule({
  declarations: [
    PpmScheduleTypeListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    PpmScheduleDetailsRoutingModule,
    PpmScheduleTypeModule
  ],
  exports:[PpmScheduleTypeListComponent]
})
export class PpmScheduleTypeListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpmScheduleComponent } from './modal/ppm-schedule.component';
import { PlanLocAssetListModule } from './widgets/plan-loc-asset-list/plan-loc-asset-list.module';
import { PpmScheduleRoutingModule } from './routing/ppm-schedule-routing';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { PpmScheduleTypeModule } from './widgets/ppm-schedule-type/ppm-schedule-type.module';
import { PpmScheduleTypeListModule } from './widgets/ppm-schedule-type-list/ppm-schedule-type-list.module';



@NgModule({
  declarations: [
    PpmScheduleComponent
  ],
  imports: [
    CommonModule,
    PpmScheduleRoutingModule,
    PlanLocAssetListModule,
    PpmScheduleTypeModule,
    PpmScheduleTypeListModule,
    PrimeNGModule
  ]
})
export class PpmScheduleModule { }

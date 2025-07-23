import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastPlanDetailsComponent } from './forecast-plan-details/forecast-plan-details.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanDetailsModule } from 'src/app/ui/plan-details/plan-details.module';
import { PpmScheduleTypeListModule } from 'src/app/ui/ppm-schedule/widgets/ppm-schedule-type-list/ppm-schedule-type-list.module';



@NgModule({
  declarations: [
    ForecastPlanDetailsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    PlanDetailsModule,
    PpmScheduleTypeListModule
  ],
  exports: [ForecastPlanDetailsComponent]
})
export class ForecastPlanDetailsModule { }

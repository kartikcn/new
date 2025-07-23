import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpmPlanComponent } from './modal/ppm-plan.component';
import { PlanListModule } from './widgets/plan-list/plan-list.module';
import { PlanStepsListModule } from './widgets/plan-steps-list/plan-steps-list.module';
import { PpmPlanRoutingModule } from './routing/ppm-plan-routing';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    PpmPlanComponent
  ],
  imports: [
    CommonModule,
    PlanListModule,
    PlanStepsListModule,
    PpmPlanRoutingModule,
    PrimeNGModule,
  ]
})
export class PpmPlanModule { }

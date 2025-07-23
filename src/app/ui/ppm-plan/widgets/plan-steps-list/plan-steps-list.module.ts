import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanStepsListComponent } from './plan-steps-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditPlanStepsModule } from '../add-edit-plan-steps/add-edit-plan-steps.module';
import { PlanTradeModule } from 'src/app/ui/plan-trade/plan-trade.module';
import { PlanToolModule } from 'src/app/ui/plan-tool/plan-tool.module';
import { PlanPartModule } from 'src/app/ui/plan-part/plan-part.module';



@NgModule({
  declarations: [
    PlanStepsListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    PlanTradeModule,
    PlanToolModule,
    PlanPartModule
  ],
  exports: [PlanStepsListComponent],
})
export class PlanStepsListModule { }

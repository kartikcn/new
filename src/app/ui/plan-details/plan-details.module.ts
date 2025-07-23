import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanDetailsComponent } from './plan-details.component';
import { PlanDetailsRoutingModule } from './routing/plan-details.routing';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditPlanModule } from '../ppm-plan/widgets/add-edit-plan/add-edit-plan.module';
import { AddEditPlanStepsModule } from '../ppm-plan/widgets/add-edit-plan-steps/add-edit-plan-steps.module';
import { DocumentsListModule } from '../documents-list/documents-list.module';
import { PlanTradeModule } from '../plan-trade/plan-trade.module';
import { PlanPartModule } from '../plan-part/plan-part.module';
import { PlanToolModule } from '../plan-tool/plan-tool.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PlanDetailsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    PlanDetailsRoutingModule,
    AddEditPlanModule,
    AddEditPlanStepsModule,
    DocumentsListModule,
    PlanTradeModule,
    PlanToolModule,
    PlanPartModule,
    ReactiveFormsModule
  ],
  exports:[PlanDetailsComponent]
})
export class PlanDetailsModule { }

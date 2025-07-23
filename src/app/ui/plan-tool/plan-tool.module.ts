import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanToolComponent } from './modal/plan-tool.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditPlanToolModule } from './widgets/add-edit-plan-tool/add-edit-plan-tool.module';



@NgModule({
  declarations: [
    PlanToolComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AddEditPlanToolModule
  ],
  exports:[PlanToolComponent]
})
export class PlanToolModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanPartComponent } from './modal/plan-part.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditPlanPartModule } from './widgets/add-edit-plan-part/add-edit-plan-part.module';



@NgModule({
  declarations: [
    PlanPartComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AddEditPlanPartModule
  ],
  exports:[PlanPartComponent]
})
export class PlanPartModule { }

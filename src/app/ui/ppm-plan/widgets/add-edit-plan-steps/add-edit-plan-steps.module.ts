import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditPlanStepsComponent } from './add-edit-plan-steps/add-edit-plan-steps.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddPlanStepsModule } from '../add-plan-steps/add-plan-steps.module';



@NgModule({
  declarations: [
    AddEditPlanStepsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    AddPlanStepsModule
  ],
  exports:[AddEditPlanStepsComponent]
})
export class AddEditPlanStepsModule { }

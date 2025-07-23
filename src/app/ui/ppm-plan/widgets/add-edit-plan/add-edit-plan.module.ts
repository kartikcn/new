import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditPlanComponent } from './add-edit-plan.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { AddPlanModule } from '../add-plan/add-plan.module';



@NgModule({
  declarations: [
    AddEditPlanComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    AddPlanModule
  ],
  exports: [AddEditPlanComponent],
})
export class AddEditPlanModule { }

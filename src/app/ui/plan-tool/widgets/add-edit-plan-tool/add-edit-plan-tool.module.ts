import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditPlanToolComponent } from './add-edit-plan-tool.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddPlanToolModule } from '../add-plan-tool/add-plan-tool.module';



@NgModule({
  declarations: [
    AddEditPlanToolComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    AddPlanToolModule
  ],
  exports:[AddEditPlanToolComponent]
})
export class AddEditPlanToolModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditPlanPartComponent } from './add-edit-plan-part.component';
import { AddPlanPartModule } from '../add-plan-part/add-plan-part.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    AddEditPlanPartComponent
  ],
  imports: [
    CommonModule,
    AddPlanPartModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
  ],
  exports:[AddEditPlanPartComponent]
})
export class AddEditPlanPartModule { }

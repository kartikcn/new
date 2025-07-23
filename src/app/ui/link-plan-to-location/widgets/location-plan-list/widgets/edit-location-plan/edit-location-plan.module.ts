import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditLocationPlanComponent } from './edit-location-plan.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddRMFormModule } from 'src/app/ui/background-loc/widgets/add-rm-form/add-rm-form.module';
import { LinkNewLocationPlanFormModule } from '../link-new-location-plan-form/link-new-location-plan-form.module';



@NgModule({
  declarations: [
    EditLocationPlanComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddRMFormModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    PrimeNGModule,
    LinkNewLocationPlanFormModule,
],
exports: [EditLocationPlanComponent],
})
export class EditLocationPlanModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditResourcesFormComponent } from './add-edit-resources-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddResourcesFormModule } from '../add-resources-form/add-resources-form.module';



@NgModule({
  declarations: [
    AddEditResourcesFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddResourcesFormModule,
    FormsModule,
    NgSelectModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
    MatCardModule,
    MatDialogModule
  ],
  exports: [AddEditResourcesFormComponent],
})
export class AddEditResourcesFormModule { }

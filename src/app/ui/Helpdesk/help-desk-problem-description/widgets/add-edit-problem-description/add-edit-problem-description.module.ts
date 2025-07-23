import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditProblemDescriptionFormComponent } from './add-edit-problem-description-form/add-edit-problem-description-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddProblemDescriptionComponent } from '../add-problem-description/add-problem-description/add-problem-description.component';
import { AddProblemDescriptionModule } from '../add-problem-description/add-problem-description.module';



@NgModule({
  declarations: [
    AddEditProblemDescriptionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ConfirmBoxDialogModule,
    NgSelectModule,
    MaterialModule,
    PrimeNGModule,
    AddProblemDescriptionModule
  ]
})
export class AddEditProblemDescriptionModule { }

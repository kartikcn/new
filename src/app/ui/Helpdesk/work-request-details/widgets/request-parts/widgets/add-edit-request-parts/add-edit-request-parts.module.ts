import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditRequestPartsComponent } from './add-edit-request-parts.component';
import { AddRequestPartsModule } from '../add-request-parts/add-request-parts.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    AddEditRequestPartsComponent
  ],
  imports: [
    CommonModule,
    AddRequestPartsModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
  ]
})
export class AddEditRequestPartsModule { }

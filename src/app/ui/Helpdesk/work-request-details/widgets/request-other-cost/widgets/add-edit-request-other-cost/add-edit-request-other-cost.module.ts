import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditRequestOtherCostComponent } from './add-edit-request-other-cost.component';
import { AddRequestOtherCostModule } from '../add-request-other-cost/add-request-other-cost.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    AddEditRequestOtherCostComponent
  ],
  imports: [
    CommonModule,
    AddRequestOtherCostModule,
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
export class AddEditRequestOtherCostModule { }

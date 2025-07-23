import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditVisitorsFormComponent } from './add-edit-visitors-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationService } from 'primeng/api';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddVisitorsModule } from '../add-visitors/add-visitors.module';



@NgModule({
  declarations: [
    AddEditVisitorsFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddVisitorsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule
  ],
  exports: [AddEditVisitorsFormComponent],
  providers: [ ConfirmationService
  ],
})
export class AddEditVisitorsModule { }

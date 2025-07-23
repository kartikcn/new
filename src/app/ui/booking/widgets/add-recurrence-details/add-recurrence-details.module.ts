import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRecurrenceDetailsComponent } from './add-recurrence-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import {RadioButtonModule} from 'primeng/radiobutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';


@NgModule({
  declarations: [
    AddRecurrenceDetailsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    MatDialogModule,
    ConfirmBoxDialogModule,
    AntDesignModule,
    RadioButtonModule,
    DirectiveModule
  ]
})
export class AddRecurrenceDetailsModule { }

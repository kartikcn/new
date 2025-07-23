import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRequestDocumentsComponent } from './add-request-documents.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';

@NgModule({
  declarations: [
    AddRequestDocumentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatDialogModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
    DirectiveModule,
    AntDesignModule,

  ],
  exports: [AddRequestDocumentsComponent]
})
export class AddRequestDocumentsModule { }

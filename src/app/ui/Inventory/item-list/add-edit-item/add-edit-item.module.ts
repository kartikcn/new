import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditItemComponent } from './add-edit-item/add-edit-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';

@NgModule({
  declarations: [AddEditItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
    DirectiveModule,
  ],
  exports: [AddEditItemComponent],
})
export class AddEditItemModule {}

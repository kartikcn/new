import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditCenterUsageComponent } from './add-edit-center-usage/add-edit-center-usage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    AddEditCenterUsageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
    DirectiveModule,
    NgSelectModule,
    PaginatorModule
  ],
  exports:[AddEditCenterUsageComponent]
})
export class AddEditCenterUsageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterBudgetListRoutingModule } from './routing/center-budget-list.routing';
import { AddEditCenterBudgetModule } from './add-edit-center-budget/add-edit-center-budget.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { CenterBudgetListComponent } from './center-budget-list.component';



@NgModule({
  declarations: [CenterBudgetListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
    DirectiveModule,
    CenterBudgetListRoutingModule,
    AddEditCenterBudgetModule
  ],
  exports:[CenterBudgetListComponent]
})
export class CenterBudgetModule { }

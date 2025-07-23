import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudegetTermsListRoutingModule } from './routing/budeget-terms-list.routing';
import { AddEditBudgetTermsModule } from './add-edit-budget-terms/add-edit-budget-terms.module';
import { BudgetTermsListComponent } from './budget-terms-list.component';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [BudgetTermsListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
    DirectiveModule,
    BudegetTermsListRoutingModule,
    AddEditBudgetTermsModule
  ],
  exports:[BudgetTermsListComponent]
})
export class BudgetTermsModule { }

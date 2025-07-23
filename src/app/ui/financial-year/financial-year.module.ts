import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialYearComponent } from './modal/financial-year.component';
import { FinancialYearRoutingModule } from './routing/financial-year-routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditFincancialYearModule } from './widgets/add-edit-fincancial-year/add-edit-fincancial-year.module';

@NgModule({
    declarations: [
        FinancialYearComponent
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
        FinancialYearRoutingModule,
        AddEditFincancialYearModule
    ],
    exports: [FinancialYearComponent]
})
export class FinancialYearModule { }

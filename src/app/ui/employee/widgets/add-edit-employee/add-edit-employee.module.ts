import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditEmployeeComponent } from './add-edit-employee.component';
import { AddEmployeeModule } from '../../../user/widgets/add-employee/add-employee.module';
import { EmployeeLocationModule } from '../employee-location/employee-location.module';
import { EmployeeContactModule } from '../employee-contact/employee-contact.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [AddEditEmployeeComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AddEmployeeModule,
        NgSelectModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        EmployeeLocationModule,
        EmployeeContactModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule
    ],
    exports: [AddEditEmployeeComponent],
    providers: []
})
export class AddEditEmpModule { }

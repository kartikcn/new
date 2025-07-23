import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddEditHolidayComponent } from './add-edit-holiday.component';
import { HolidayDialogueProvider } from '../../provider/holiday.provider';
import { AddHolidayFormModule } from '../add-holiday-form/add-holiday-form.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
    declarations: [AddEditHolidayComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        AddHolidayFormModule
    ],
    exports: [AddEditHolidayComponent],
    providers: [HolidayDialogueProvider, ConfirmationService
    ]
})
export class AddHolidayModule { }

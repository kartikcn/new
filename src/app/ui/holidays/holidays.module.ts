import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { HolidaysComponent } from './modal/holidays.component';
import { HolidayRoutingModule } from './routing/holiday-routing';
import { AddHolidayModule } from './widgets/add-edit-holiday/add-edit-holiday.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [HolidaysComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        HolidayRoutingModule,
        AddHolidayModule,
        PaginatorModule
    ],
    exports: [HolidaysComponent],
    providers: []
})
export class HolidayModule { }

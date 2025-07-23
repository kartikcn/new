import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AddEditEmpModule } from 'src/app/ui/employee/widgets/add-edit-employee/add-edit-employee.module';
import { AddRoomStatisticsReportTableComponent } from './add-room-statistics-report-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
    declarations: [AddRoomStatisticsReportTableComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AddEditEmpModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        MatTooltipModule
    ],
    exports: [AddRoomStatisticsReportTableComponent],
    providers: []
})
export class AddRoomStatisticsReportTableModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SummeryRequestReportsComponent } from './modal/summery-request-report.component';
import { SummeryRequestReportsRoutingModule } from './routing/summery-request-reports-routing';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AddTableModule } from '../requests-by-asset-reports/widgets/add-table/add-table.module';


@NgModule({
    declarations: [
        SummeryRequestReportsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        PrimeNGModule,
        SummeryRequestReportsRoutingModule,
        AddTableModule
    ],
    exports: [SummeryRequestReportsComponent],
    providers: []
})
export class SummeryRequestReportsModule { }

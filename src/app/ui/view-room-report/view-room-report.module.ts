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
import { ToggleButtonModule } from 'primeng/togglebutton';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ViewRoomReportComponent } from './view-room-report.component';
import { ViewRoomReportRoutingModule } from './routing/view-room-report.routing';
import { AddRoomReportTableModule } from './widgets/add-room-report-table/add-room-report-table.module';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [
        ViewRoomReportComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        PrimeNGModule,
        DirectiveModule,
        NgxChartsModule,
        ViewRoomReportRoutingModule,
        AddRoomReportTableModule,
        PaginatorModule
    ],
    exports: [ViewRoomReportComponent],
    providers: []
})
export class ViewRoomReportModule { }
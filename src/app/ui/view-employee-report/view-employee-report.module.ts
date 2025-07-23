import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ViewEmployeeReportRoutingModule } from './routing/view-employee-report.routing';
import { ViewEmployeeReportComponent } from './view-employee-report.component';
import { AddEmpReportTableModule } from './widgets/add-emp-report-table/add-emp-report-table.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [
        ViewEmployeeReportComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        PrimeNGModule,
        DirectiveModule,
        NgxChartsModule,
        ViewEmployeeReportRoutingModule,
        AddEmpReportTableModule,
        PaginatorModule
    ],
    exports: [ViewEmployeeReportComponent],
    providers: []
})
export class ViewEmployeeReportModule { }

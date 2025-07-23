import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SummaryRequestReportsPpmComponent } from '../modal/summary-request-reports-ppm.component';

const routes: Routes = [
        { path: '', component: SummaryRequestReportsPpmComponent }
];

@NgModule({
        imports: [
                CommonModule,
                RouterModule.forChild(routes)
        ],
        exports: [
                RouterModule
        ],
        declarations: []
})
export class PPMSummaryRequestReportRoutingModule { }

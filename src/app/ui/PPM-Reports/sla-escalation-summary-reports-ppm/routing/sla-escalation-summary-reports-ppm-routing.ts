import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SlaEscalationSummaryReportsPpmComponent } from '../modal/sla-escalation-summary-reports-ppm.component';

const routes: Routes = [
        { path: '', component: SlaEscalationSummaryReportsPpmComponent }
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
export class SLAEscalationSummaryReportPPMRoutingModule { }

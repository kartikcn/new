import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SlaEscalatedSummaryReportsComponent } from '../modal/sla-escalated-summary-reports.component';

const routes: Routes = [
  { path: '', component: SlaEscalatedSummaryReportsComponent }
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
export class SlaEscalatedSummaryReportsRoutingModule { }

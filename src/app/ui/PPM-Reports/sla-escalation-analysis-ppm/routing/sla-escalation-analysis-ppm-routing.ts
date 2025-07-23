import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SlaEscalationAnalysisPpmComponent } from '../modal/sla-escalation-analysis-ppm.component';

const routes: Routes = [
  { path: '', component: SlaEscalationAnalysisPpmComponent }
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
export class SlaEscalationAnalysisPPMRoutingModule { }

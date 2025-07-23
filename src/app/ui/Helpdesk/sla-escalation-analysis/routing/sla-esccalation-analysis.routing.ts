import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SlaEscalationAnalysisComponent } from '../modal/sla-escalation-analysis.component';

const routes: Routes = [
  { path: '', component: SlaEscalationAnalysisComponent }
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
export class SlaEscalationAnalysisRoutingModule { }

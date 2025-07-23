import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaEscalationAnalysisComponent } from './modal/sla-escalation-analysis.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SlaEscalationAnalysisRoutingModule } from './routing/sla-esccalation-analysis.routing';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    SlaEscalationAnalysisComponent
  ],
  imports: [
    CommonModule,
    SlaEscalationAnalysisRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    PrimeNGModule,
    PaginatorModule
  ],
  exports: [SlaEscalationAnalysisComponent]
})
export class SlaEscalationAnalysisModule { }

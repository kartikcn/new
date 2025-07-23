import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartsUsageAnalysisComponent } from './model/parts-usage-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TabViewModule } from 'primeng/tabview';
import { PartsUsageAnalysisRoutingModule } from './routing/parts-usage-analysis.routing';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    PartsUsageAnalysisComponent
  ],
  imports: [
    CommonModule,
    PartsUsageAnalysisRoutingModule,
    FormsModule,
    PrimeNGModule,
    TabViewModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaginatorModule
  ],
  exports: [PartsUsageAnalysisComponent]
})
export class PartsUsageAnalysisModule { }

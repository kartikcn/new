import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicianTimeUsageAnalysisComponent } from './model/technician-time-usage-analysis.component';
import { TechnicianTimeUsageAnalysisRoutingModule } from './routing/technician-time-usage-analysis.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TimelineModule } from 'primeng/timeline';
import { TabViewModule } from 'primeng/tabview';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MaterialModule } from 'src/app/material/material.module';




@NgModule({
  declarations: [
    TechnicianTimeUsageAnalysisComponent
  ],
  imports: [
    CommonModule,
    TechnicianTimeUsageAnalysisRoutingModule,
    FormsModule,
    PrimeNGModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [TechnicianTimeUsageAnalysisComponent]
})
export class TechnicianTimeUsageAnalysisModule { }

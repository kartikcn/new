import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkRequestReportsComponent } from './model/work-request-reports.component';
import { WorkRequestReportsRoutingModule } from './routing/work-request-report.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AddTableModule } from './widgets/add-table/add-table.module';




@NgModule({
  declarations: [
    WorkRequestReportsComponent
  ],
  imports: [
    CommonModule,
    WorkRequestReportsRoutingModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    PrimeNGModule,
    TabViewModule,
    TimelineModule,
    ProgressSpinnerModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgSelectModule,
    AntDesignModule,
    SelectButtonModule,
    DirectiveModule,
    AddTableModule

  ]
})
export class WorkRequestReportsModule { }

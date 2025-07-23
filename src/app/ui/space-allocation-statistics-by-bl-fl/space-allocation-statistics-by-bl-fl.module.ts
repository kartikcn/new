import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AddRoomReportTableModule } from '../view-room-report/widgets/add-room-report-table/add-room-report-table.module';
import { SpaceAllocationRoomListModule } from '../space-allocation-statistics/widgets/space-allocation-room-list/space-allocation-room-list.module';
import { SpaceAllocationStatisticsByBlFlRoutingModule } from './routing/space-allocation-statistics-by-bl-fl.routing';
import { SpaceAllocationStatisticsByBlFlComponent } from './space-allocation-statistics-by-bl-fl.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [
    SpaceAllocationStatisticsByBlFlComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    MatTooltipModule,
    SpaceAllocationRoomListModule,
    SpaceAllocationStatisticsByBlFlRoutingModule,
    NgxChartsModule,
    AddRoomReportTableModule,
    PaginatorModule
  ],
  exports: [SpaceAllocationStatisticsByBlFlComponent]
})
export class SpaceAllocationStatisticsByBlFlModule { }
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
import { SpaceAllocationStatisticsByDivDepRoutingModule } from './routing/space-allocation-statistics-by-div-dep.routing';
import { SpaceAllocationStatisticsByDivDepComponent } from './space-allocation-statistics-by-div-dep.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [
    SpaceAllocationStatisticsByDivDepComponent,
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
    SpaceAllocationStatisticsByDivDepRoutingModule,
    NgxChartsModule,
    AddRoomReportTableModule,
    PaginatorModule
  ],
  exports: [SpaceAllocationStatisticsByDivDepComponent]
})
export class SpaceAllocationStatisticsByDivDepModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AllocationReportByBlFlComponent } from './allocation-report-by-bl-fl.component';
import { AllocationReportByBlFlRoutingModule } from './routing/allocation-report-by-bl-fl.routing';
import { SpaceAllocationRoomListModule } from '../space-allocation-statistics/widgets/space-allocation-room-list/space-allocation-room-list.module';
import { AddRoomReportTableModule } from '../view-room-report/widgets/add-room-report-table/add-room-report-table.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { RoomAvailibilityReportTableModule } from './widgets/room-availibility-report-table/room-availibility-report-table.module';

@NgModule({
  declarations: [
    AllocationReportByBlFlComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    AllocationReportByBlFlRoutingModule,
    SpaceAllocationRoomListModule,
    AddRoomReportTableModule,
    GoogleChartsModule,
    RoomAvailibilityReportTableModule,
  ],
  exports: [AllocationReportByBlFlComponent]
})
export class AllocationReportByBlFlModule { }
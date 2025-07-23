import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SpaceAllocationRoomListModule } from '../space-allocation-statistics/widgets/space-allocation-room-list/space-allocation-room-list.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { AllocationReportByDivDepComponent } from './allocation-report-by-div-dep.component';
import { AllocationReportByDivDepRoutingModule } from './routing/allocation-report-by-div-dep.routing';
import { RoomAvailibilityReportTableModule } from '../allocation-report-by-bl-fl/widgets/room-availibility-report-table/room-availibility-report-table.module';


@NgModule({
  declarations: [
    AllocationReportByDivDepComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    AllocationReportByDivDepRoutingModule,
    SpaceAllocationRoomListModule,
    GoogleChartsModule,
    RoomAvailibilityReportTableModule
  ],
  exports: [AllocationReportByDivDepComponent]
})
export class AllocationReportByDivDepModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SpaceAllocationRoomListModule } from '../space-allocation-statistics/widgets/space-allocation-room-list/space-allocation-room-list.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { RoomAvailibilityReportTableModule } from '../allocation-report-by-bl-fl/widgets/room-availibility-report-table/room-availibility-report-table.module';
import { AllocationReportBySubDepComponent } from './allocation-report-by-sub-dep.component';
import { AllocationReportBySubDepRoutingModule } from './routing/allocation-report-by-sub-dep.routing';


@NgModule({
  declarations: [
    AllocationReportBySubDepComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    AllocationReportBySubDepRoutingModule,
    SpaceAllocationRoomListModule,
    GoogleChartsModule,
    RoomAvailibilityReportTableModule
  ],
  exports: [AllocationReportBySubDepComponent]
})
export class AllocationReportBySubDepModule { }
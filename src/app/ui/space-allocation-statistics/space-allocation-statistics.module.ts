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
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpaceAllocationRoomListModule } from './widgets/space-allocation-room-list/space-allocation-room-list.module';
import { SpaceAllocationStatisticsRoutingModule } from './routing/space-allocation-statistics.routing';
import { SpaceAllocationStatisticsComponent } from './space-allocation-statistics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AddRoomReportTableModule } from '../view-room-report/widgets/add-room-report-table/add-room-report-table.module';



@NgModule({
  declarations: [
    SpaceAllocationStatisticsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ConfirmBoxDialogModule,
    NgSelectModule,
    NgxSpinnerModule,
    RadioButtonModule,
    MatTooltipModule,
    SpaceAllocationRoomListModule,
    SpaceAllocationStatisticsRoutingModule,
    NgxChartsModule,
    AddRoomReportTableModule
  ],
  exports: [SpaceAllocationStatisticsComponent]
})
export class SpaceAllocationStatisticsModule { }
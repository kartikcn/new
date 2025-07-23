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
import { ViewOccupancyStatisticsComponent } from './view-occupancy-statistics.component';
import { ViewOccupancyStatisticsRoutingModule } from './routing/view-occupancy-statistics.routing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddRoomStatisticsReportTableModule } from './widgets/add-room-statistics-report-table/add-room-statistics-report-table.module';


@NgModule({
  declarations: [
    ViewOccupancyStatisticsComponent
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
    ViewOccupancyStatisticsRoutingModule,
    MatTooltipModule,
    AddRoomStatisticsReportTableModule
  ],
  exports: [ViewOccupancyStatisticsComponent]
})
export class ViewOccupancyStatisticsModule { }
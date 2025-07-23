import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingReportsByMonthComponent } from './booking-reports-by-month.component';
import { BookingReportsByMonthRoutingModule } from '../../routing/booking-reports-bymonth-routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    BookingReportsByMonthComponent,
  ],
  imports: [
    CommonModule,
    BookingReportsByMonthRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MaterialModule,
    MatTooltipModule
  ]
})
export class BookingReportsByMonthModule { }

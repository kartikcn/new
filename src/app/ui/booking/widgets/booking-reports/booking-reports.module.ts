import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { BookingReportsRoutingModule } from '../../routing/booking-reports-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
   BookingReportComponent,
  ],
  imports: [
    CommonModule,
    BookingReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MaterialModule,
    NgSelectModule,
    MatTooltipModule
  ]
})
export class BookingReportsModule { }
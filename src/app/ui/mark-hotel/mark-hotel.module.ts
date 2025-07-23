import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MarkHotelComponent } from './mark-hotel.component';
import { MarkHotelRoutingModule } from './routing/mark-hotel-routing.module';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [ MarkHotelComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
    MarkHotelRoutingModule,
    PaginatorModule
  ],
  exports: [MarkHotelComponent ],
  providers: [
  ]
})
export class MarkHotelModule { }

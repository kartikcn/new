import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MarkReservComponent } from './mark-reserv.component';
import { MarkReservRoutingModule } from './routing/mark-reserv-routing.module';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [ MarkReservComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatDialogModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    PrimeNGModule,
    MarkReservRoutingModule,
    PaginatorModule
  ],
  exports: [MarkReservComponent ],
  providers: [
  ]
})
export class MarkReservModule { }

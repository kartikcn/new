import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PpmPlansListComponent } from './ppm-plans-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    PpmPlansListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    PaginatorModule
  ],
  exports:[PpmPlansListComponent]
})
export class PpmPlansListModule { }

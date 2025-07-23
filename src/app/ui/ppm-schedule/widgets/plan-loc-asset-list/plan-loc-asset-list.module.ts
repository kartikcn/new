import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanLocAssetListComponent } from './plan-loc-asset-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    PlanLocAssetListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorModule
  ],
  exports: [PlanLocAssetListComponent]
})
export class PlanLocAssetListModule { }

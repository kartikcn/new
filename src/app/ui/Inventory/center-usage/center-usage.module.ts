import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterUsageListComponent } from './center-usage-list/center-usage-list.component';
import { CenterUsageRoutingModule } from './routing/center-usage.routing';
import { AddEditCenterUsageModule } from './add-edit-center-usage/add-edit-center-usage.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [CenterUsageListComponent],
  imports: [
    CommonModule,
    AddEditCenterUsageModule,
    CenterUsageRoutingModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorModule,
    MaterialModule,
  ],
  exports: [CenterUsageListComponent],
})
export class CenterUsageModule {}

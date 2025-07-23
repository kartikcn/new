import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanListComponent } from './plan-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditPlanModule } from '../add-edit-plan/add-edit-plan.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    PlanListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    AddEditPlanModule,
    MatTooltipModule,
    PaginatorModule
  ],
  exports: [PlanListComponent],
})
export class PlanListModule { }

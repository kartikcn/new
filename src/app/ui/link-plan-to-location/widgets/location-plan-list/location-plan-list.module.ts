import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPlanListComponent } from './modal/location-plan-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { EditLocationPlanModule } from './widgets/edit-location-plan/edit-location-plan.module';
import { LinkMultipleLocationsModule } from '../link-multiple-locations/link-multiple-locations.module';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    LocationPlanListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    EditLocationPlanModule,
    LinkMultipleLocationsModule,
    PaginatorModule
  ],
  exports: [LocationPlanListComponent]
})
export class LocationPlanListModule { }

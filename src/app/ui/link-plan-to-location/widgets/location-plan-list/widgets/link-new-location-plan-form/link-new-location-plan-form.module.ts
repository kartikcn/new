import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkNewLocationPlanFormComponent } from './link-new-location-plan-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    LinkNewLocationPlanFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    PrimeNGModule,
  ],
  exports: [LinkNewLocationPlanFormComponent]
})
export class LinkNewLocationPlanFormModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkPlanToLocationScreenComponent } from './modal/link-plan-to-location-screen.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    LinkPlanToLocationScreenComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule
  ],
  exports:[LinkPlanToLocationScreenComponent]
})
export class LinkPlanToLocationScreenModule { }

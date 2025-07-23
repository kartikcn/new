import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnLinkPlanToLocationScreenComponent } from './modal/un-link-plan-to-location-screen.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    UnLinkPlanToLocationScreenComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule
  ],
  exports:[UnLinkPlanToLocationScreenComponent]
})
export class UnLinkPlanToLocationScreenModule { }

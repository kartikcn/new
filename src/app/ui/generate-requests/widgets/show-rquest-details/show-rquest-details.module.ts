import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowRequestDetailsComponent } from './show-request-details.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowRequestDetailsRoutingModule } from '../../routing/show-request-details-routing';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    ShowRequestDetailsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    FormsModule,
    ReactiveFormsModule,
    ShowRequestDetailsRoutingModule,
    MatTooltipModule
  ],
  exports: [ShowRequestDetailsComponent]
})
export class ShowRquestDetailsModule { }

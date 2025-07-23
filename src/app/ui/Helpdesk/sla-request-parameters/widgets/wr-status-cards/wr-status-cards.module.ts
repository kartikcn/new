import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrStatusCardsComponent } from './wr-status-cards.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    WrStatusCardsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports:[WrStatusCardsComponent]
})
export class WrStatusCardsModule { }

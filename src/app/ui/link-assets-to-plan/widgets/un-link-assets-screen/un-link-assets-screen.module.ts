import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnLinkAssetsScreenComponent } from './un-link-assets-screen.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    UnLinkAssetsScreenComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports: [UnLinkAssetsScreenComponent]
})
export class UnLinkAssetsScreenModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkAssetsScreenComponent } from './link-assets-screen.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    LinkAssetsScreenComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports: [LinkAssetsScreenComponent]
})
export class LinkAssetsScreenModule { }

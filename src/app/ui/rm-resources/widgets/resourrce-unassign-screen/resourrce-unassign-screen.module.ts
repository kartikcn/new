import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceUnassignScreenComponent } from './resource-unassign-screen.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    ResourceUnassignScreenComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports: [ResourceUnassignScreenComponent]
})
export class ResourrceUnassignScreenModule { }

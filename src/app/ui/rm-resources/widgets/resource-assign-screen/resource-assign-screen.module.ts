import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceAssignScreenComponent } from './resource-assign-screen.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';




@NgModule({
  declarations: [
    ResourceAssignScreenComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports: [ResourceAssignScreenComponent]
})
export class ResourceAssignScreenModule { }

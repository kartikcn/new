import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkMultipleLocationsComponent } from './link-multiple-locations.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    LinkMultipleLocationsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [LinkMultipleLocationsComponent]
})
export class LinkMultipleLocationsModule { }

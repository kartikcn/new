import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetWarrantyComponent } from './asset-warranty.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    AssetWarrantyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule
  ],
  exports:[AssetWarrantyComponent]
})
export class AssetWarrantyModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetInsuranceComponent } from './asset-insurance.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AssetInsuranceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    DirectiveModule
  ],
  exports:[AssetInsuranceComponent]
})
export class AssetInsuranceModule { }

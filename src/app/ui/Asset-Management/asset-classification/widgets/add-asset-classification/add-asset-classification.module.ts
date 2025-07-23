import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssetClassificationComponent } from './add-asset-classification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddAssetClassificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
    AntDesignModule,
    DirectiveModule
  ],
  exports:[AddAssetClassificationComponent]
})
export class AddAssetClassificationModule { }

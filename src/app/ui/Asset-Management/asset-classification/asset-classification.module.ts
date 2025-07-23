import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetClassificationComponent } from './modal/asset-classification.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { TreeModule } from 'primeng/tree';
import { AssetClassificationRoutingModule } from './routing/asset-classification-routing';
import { AddAssetClassificationModule } from './widgets/add-asset-classification/add-asset-classification.module';



@NgModule({
  declarations: [
    AssetClassificationComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    TreeModule,
    AssetClassificationRoutingModule,
    AddAssetClassificationModule
  ]
})
export class AssetClassificationModule { }

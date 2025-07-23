import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectAssetClassificationComponent } from './select-asset-classification.component';
import { TreeModule } from 'primeng/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    SelectAssetClassificationComponent
  ],
  imports: [
    CommonModule,
    TreeModule,
    MatButtonModule,
    MatDialogModule,
    PrimeNGModule,
    MaterialModule
  ]
})
export class SelectAssetClassificationModule { }

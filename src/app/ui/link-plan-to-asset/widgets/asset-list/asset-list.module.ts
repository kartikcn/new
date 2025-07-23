import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetListComponent } from './asset-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AssetListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    PaginatorModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[AssetListComponent]
})
export class AssetListModule { }

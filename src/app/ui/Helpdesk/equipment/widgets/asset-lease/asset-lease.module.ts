import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetLeaseComponent } from './asset-lease.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AssetLeaseComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    DirectiveModule
  ],
  exports:[AssetLeaseComponent]
})
export class AssetLeaseModule { }

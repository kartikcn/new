import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetLocationComponent } from './asset-location.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AssetLocationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    MatIconModule,
    MatTooltipModule,
    PrimeNGModule,
    DirectiveModule
  ],
  exports:[AssetLocationComponent]
})
export class AssetLocationModule { }

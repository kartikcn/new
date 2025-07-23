import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { HighlightByRmcatComponent } from './highlight-by-rmcat.component';
import { HightlightByRmCatRoutingModule } from './routing/highlight-by-rmcat.routing';


@NgModule({
  declarations: [
    HighlightByRmcatComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    HightlightByRmCatRoutingModule,
    SvgViewModule
  ],
  exports: [HighlightByRmcatComponent]
})
export class HighlightByRmCatModule { }
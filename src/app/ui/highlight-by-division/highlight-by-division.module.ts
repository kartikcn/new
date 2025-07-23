import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { HightlightByDivisionRoutingModule } from './routing/highlight-by-division.routing';
import { HighlightByDivisionComponent } from './highlight-by-division.component';

@NgModule({
  declarations: [
    HighlightByDivisionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    HightlightByDivisionRoutingModule,
    SvgViewModule
  ],
  exports: [HighlightByDivisionComponent]
})
export class HighlightByDivisionModule { }
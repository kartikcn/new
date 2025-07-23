import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { ViewCommonAreaComponent } from './view-common-area.component';
import { ViewCommonAreaRoutingModule } from './routing/view-common-area.routing';

@NgModule({
  declarations: [
    ViewCommonAreaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    ViewCommonAreaRoutingModule,
    SvgViewModule
  ],
  exports: [ViewCommonAreaComponent]
})
export class ViewCommonAreaModule { }
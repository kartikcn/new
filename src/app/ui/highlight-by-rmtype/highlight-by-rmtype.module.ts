import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { HighlightByRmtypeComponent } from './highlight-by-rmtype.component';
import { HightlightByRmTypeRoutingModule } from './routing/highlight-by-rmtype.routing';


@NgModule({
  declarations: [
    HighlightByRmtypeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    ConfirmBoxDialogModule,
    NgSelectModule,
    NgxSpinnerModule,
    HightlightByRmTypeRoutingModule,
    SvgViewModule
  ],
  exports: [HighlightByRmtypeComponent]
})
export class HighlightByRmTypeModule { }
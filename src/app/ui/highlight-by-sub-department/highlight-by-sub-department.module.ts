import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { HighlightBySubDepartmentComponent } from './highlight-by-sub-department.component';
import { HightlightBySubDepartmentRoutingModule } from './routing/highlight-by-sub-department.routing';

@NgModule({
  declarations: [
    HighlightBySubDepartmentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    NgSelectModule,
    NgxSpinnerModule,
    HightlightBySubDepartmentRoutingModule,
    SvgViewModule
  ],
  exports: [HighlightBySubDepartmentComponent]
})
export class HighlightBySubDepartmentModule { }
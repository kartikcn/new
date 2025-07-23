import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { SvgViewComponent } from './svg-view.component';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    SvgViewComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
    NgxSpinnerModule
  ],
  
  exports: [SvgViewComponent]
})
export class SvgViewModule { }

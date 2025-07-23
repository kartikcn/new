import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AddArrangementComponent } from './add-arrangement.component';


@NgModule({
  declarations: [
    AddArrangementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    PrimeNGModule,
    AntDesignModule,
    DirectiveModule,
  ],
  exports: [AddArrangementComponent]
})
export class AddArrangementModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RmConfigFormComponent } from './rm-config-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import {InputMaskModule} from 'primeng/inputmask';



@NgModule({
  declarations: [
    RmConfigFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    DirectiveModule,
    PrimeNGModule,
    AntDesignModule,
    InputMaskModule,
    DirectiveModule

  ],
  exports: [RmConfigFormComponent]
})
export class RmConfigFormModule { }

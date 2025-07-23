import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import {InputMaskModule} from 'primeng/inputmask';
import { RmConfigListComponent } from './rm-config-list.component';

@NgModule({
  declarations: [
    RmConfigListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    DirectiveModule,
    PrimeNGModule,
    AntDesignModule,
    InputMaskModule
  ],
  exports: [RmConfigListComponent]
})
export class RmConfigListModule { }

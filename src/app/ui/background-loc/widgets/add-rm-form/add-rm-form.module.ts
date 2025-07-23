import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { AddRmFormComponent } from './add-rm-form.component';
import { AntDesignModule } from '../../../../material/ant-design.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ AddRmFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    DirectiveModule
  ],
  exports: [AddRmFormComponent]
})
export class AddRMFormModule { }

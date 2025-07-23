import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { AddFlFormComponent } from './add-fl-form.component';
import { AntDesignModule } from '../../../../material/ant-design.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrimeNGModule } from 'src/app/material/primemg.module';


@NgModule({
  declarations: [AddFlFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    DirectiveModule,
    PrimeNGModule,
    MatTooltipModule,
  ],
  exports: [AddFlFormComponent]
})
export class AddFLFormModule { }

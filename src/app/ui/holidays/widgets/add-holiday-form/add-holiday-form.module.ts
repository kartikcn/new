import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MaterialModule } from 'src/app/material/material.module';
import { AddHolidayFormComponent } from './add-holiday-form.component';
import { AntDesignModule } from '../../../../material/ant-design.module';
import { PrimeNGModule } from '../../../../material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';


@NgModule({
  declarations: [AddHolidayFormComponent],
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
  exports: [AddHolidayFormComponent]
})
export class AddHolidayFormModule { }

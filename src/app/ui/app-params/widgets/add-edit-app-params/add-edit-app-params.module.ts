import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditAppParamsComponent } from './add-edit-app-params.component';
import { AddAppParamsComponent } from '../add-app-params/add-app-params.component';

@NgModule({
  declarations: [
    AddEditAppParamsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    PrimeNGModule,
    AddAppParamsComponent
  ],
  exports: [AddEditAppParamsComponent]
})
export class AddEditAppParamsModule { }

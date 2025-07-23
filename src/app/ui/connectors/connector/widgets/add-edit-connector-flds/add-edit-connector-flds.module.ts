import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditConnectorFldsComponent } from './add-edit-connector-flds.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddConnectorFldsModule } from '../add-connector-flds/add-connector-flds.module';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    AddEditConnectorFldsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AddConnectorFldsModule
  ]
})
export class AddEditConnectorFldsModule { }

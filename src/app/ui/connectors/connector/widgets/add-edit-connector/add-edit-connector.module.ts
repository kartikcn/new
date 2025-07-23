import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditConnectorComponent } from './add-edit-connector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddConnectorModule } from '../add-connector/add-connector.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    AddEditConnectorComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AddConnectorModule
  ],
  exports:[AddEditConnectorComponent]
})
export class AddEditConnectorModule { }

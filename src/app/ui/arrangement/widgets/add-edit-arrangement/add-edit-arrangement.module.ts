import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditArrangementComponent } from './add-edit-arrangement.component';
import { AddArrangementComponent } from '../add-arrangement/add-arrangement.component';



@NgModule({
  declarations: [
    AddEditArrangementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    PrimeNGModule,
    AddArrangementComponent
  ],
  exports: [AddEditArrangementComponent]
})
export class AddEditArrangementModule { }

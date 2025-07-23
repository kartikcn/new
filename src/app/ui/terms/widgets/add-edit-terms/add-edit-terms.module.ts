import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditTermsComponent } from './add-edit-terms.component';
import { AddTermsModule } from '../add-terms/add-terms.module';


@NgModule({
  declarations: [
    AddEditTermsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    PrimeNGModule,
    AddTermsModule,
  ],
  exports: [AddEditTermsComponent],
  
})
export class AddEditTermsModule { }
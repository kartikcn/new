import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditMessagesComponent } from './add-edit-messages.component';
import { AddMessagesComponent } from '../add-messages/add-messages.component';
import { AddMessagesModule } from '../add-messages/add-messages.module';


@NgModule({
  declarations: [
    AddEditMessagesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    PrimeNGModule,
    AddMessagesModule
  ],
  exports: [AddEditMessagesComponent]
})
export class AddEditMessagesModule { }

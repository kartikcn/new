import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditDivisionComponent } from './add-edit-division.component';
import { AddDivisionModule } from '../add-division/add-division.module';



@NgModule({
  declarations: [
    AddEditDivisionComponent
  ],
  imports: [
    CommonModule,
    AddDivisionModule
  ]
})
export class AddEditDivisionModule { }

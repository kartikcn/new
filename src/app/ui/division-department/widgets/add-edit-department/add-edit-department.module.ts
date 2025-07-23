import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditDepartmentComponent } from './add-edit-department.component';
import { AddDepartmentModule } from '../add-department/add-department.module';



@NgModule({
  declarations: [
    AddEditDepartmentComponent
  ],
  imports: [
    CommonModule,
    AddDepartmentModule
  ]
})
export class AddEditDepartmentModule { }

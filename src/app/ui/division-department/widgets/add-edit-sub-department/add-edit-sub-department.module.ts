import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditSubDepartmentComponent } from './add-edit-sub-department.component';
import { AddSubDepartmentModule } from '../add-sub-department/add-sub-department.module';



@NgModule({
  declarations: [
    AddEditSubDepartmentComponent
  ],
  imports: [
    CommonModule,
    AddSubDepartmentModule
  ]
})
export class AddEditSubDepartmentModule { }

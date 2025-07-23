import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DivisionDepartmentRoutingModule } from './routing/division-department.routing';
import { DivisionDepartmentComponent } from './division-department.component';
import { TreeModule } from 'primeng/tree';
import { AddDivisionModule } from './widgets/add-division/add-division.module';
import { AddDepartmentModule } from './widgets/add-department/add-department.module';
import { AddSubDepartmentModule } from './widgets/add-sub-department/add-sub-department.module';
import { AddEditDivisionModule } from './widgets/add-edit-division/add-edit-division.module';
import { AddEditDepartmentModule } from './widgets/add-edit-department/add-edit-department.module';
import { AddEditSubDepartmentModule } from './widgets/add-edit-sub-department/add-edit-sub-department.module';


@NgModule({
    declarations: [
        DivisionDepartmentComponent
    ],
    imports: [
        CommonModule,
        PrimeNGModule,
        DivisionDepartmentRoutingModule,
        TreeModule,
        AddDivisionModule,
        AddDepartmentModule,
        AddSubDepartmentModule,
        AddEditDivisionModule,
        AddEditDepartmentModule,
        AddEditSubDepartmentModule
    ],
    exports: [DivisionDepartmentComponent],
    providers: []
})
export class DivisionDepartmentModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeContactComponent } from './employee-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';



@NgModule({
    declarations: [
        EmployeeContactComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        PrimeNGModule,
        DirectiveModule,
        AntDesignModule
    ],
    exports: [EmployeeContactComponent]
})
export class EmployeeContactModule { }

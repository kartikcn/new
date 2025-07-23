import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeLocationComponent } from './employee-location.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
    declarations: [
        EmployeeLocationComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        PrimeNGModule,
        RadioButtonModule,
        AntDesignModule,
        MatTooltipModule
    ],
    exports: [EmployeeLocationComponent]
})
export class EmployeeLocationModule { }

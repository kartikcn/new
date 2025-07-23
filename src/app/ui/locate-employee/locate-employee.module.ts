import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { LocateEmployeeComponent } from './locate-employee.component';
import { LocateEmployeeRoutingModule } from './routing/locate-employee.routing';


@NgModule({
    declarations: [
        LocateEmployeeComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        PrimeNGModule,
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule,
        NgxSpinnerModule,
        LocateEmployeeRoutingModule,
        SvgViewModule,
        NgxSpinnerModule,
    ],
    exports: [LocateEmployeeComponent],
    providers: []
})
export class LocateEmployeeModule { }
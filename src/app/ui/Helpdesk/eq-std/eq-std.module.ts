import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EqStdComponent } from './modal/eq-std.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { EqStdRoutingModule } from './routing/eq-std.routing';
import { AddEqStdFormComponent } from './widgets/add-eq-std/add-eq-std-form/add-eq-std-form.component';
import { AddEditEqStdFormComponent } from './widgets/add-edit-eq-std/add-edit-eq-std-form/add-edit-eq-std-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
    declarations: [
        EqStdComponent,
        AddEqStdFormComponent,
        AddEditEqStdFormComponent
    ],
    imports: [
        CommonModule,
        EqStdRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MaterialModule,
        AntDesignModule,
        PrimeNGModule,
        MatTooltipModule,
        PaginatorModule,
        DirectiveModule
    ],
    exports: [EqStdComponent],
    providers: []
})
export class EqStdModule { }

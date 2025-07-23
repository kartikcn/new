import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { AppParamsComponent } from './app-params.component';
import { AppParamsRoutingModule } from './routing/app-params-routing';
import { AddAppParamsComponent } from './widgets/add-app-params/add-app-params.component';
import { AddEditAppParamsComponent } from './widgets/add-edit-app-params/add-edit-app-params.component';
import { ToastrModule } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
    declarations: [AppParamsComponent, AddEditAppParamsComponent, AddAppParamsComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        AppParamsRoutingModule,
        ToastrModule,
        MatTooltipModule,
        PaginatorModule,
        DirectiveModule
    ],
    exports: [AppParamsComponent]
})
export class AppParamsModule { }

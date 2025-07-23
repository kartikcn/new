import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaRequestParametersComponent } from './model/sla-request-parameters.component';
import { SLARequestRoutingModule } from './routing/sla-request.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditSlaModule } from './widgets/add-edit-sla/add-edit-sla.module';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
    declarations: [
        SlaRequestParametersComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        SLARequestRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        TabViewModule,
        PaginatorModule
    ],
    exports: [SlaRequestParametersComponent],
    providers: []
})
export class SlaRequestParametersModule { }

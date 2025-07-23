import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSlaResponseComponent } from './add-sla-response.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AddSlaRequestStepsModule } from '../add-sla-request-steps/add-sla-request-steps.module';
import { SelectButtonModule } from 'primeng/selectbutton';



@NgModule({
    declarations: [
        AddSlaResponseComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        DirectiveModule,
        AddSlaRequestStepsModule,
        SelectButtonModule
    ],
    exports: [AddSlaResponseComponent],
    providers: []
})
export class AddSlaResponseModule { }

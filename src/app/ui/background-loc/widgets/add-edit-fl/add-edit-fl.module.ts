import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddEditFlComponent } from './add-edit-fl.component';
import { AddFLFormModule } from '../add-fl-form/add-fl-form.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
    declarations: [AddEditFlComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddFLFormModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule
    ],
    exports: [AddEditFlComponent],
    providers: [ConfirmationService
    ]
})
export class AddFLModule { }

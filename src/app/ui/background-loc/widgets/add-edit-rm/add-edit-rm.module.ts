import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddBLFormModule } from '../add-bl-form/add-bl-form.module';
import { AddEditRmComponent } from './add-edit-rm.component';
import { AddRMFormModule } from '../add-rm-form/add-rm-form.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
    declarations: [AddEditRmComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddBLFormModule,
        AddRMFormModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule
    ],
    exports: [AddEditRmComponent],
    providers: [ConfirmationService
    ]
})
export class AddRMModule { }

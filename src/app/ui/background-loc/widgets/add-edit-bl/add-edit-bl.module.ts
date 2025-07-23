import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddEditBlComponent } from './add-edit-bl.component';
import { AddBLFormModule } from '../add-bl-form/add-bl-form.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [AddEditBlComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddBLFormModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        MatIconModule,
        MatButtonModule,
    ],
    exports: [AddEditBlComponent],
    providers: [ConfirmationService
    ]
})
export class AddBLModule { }

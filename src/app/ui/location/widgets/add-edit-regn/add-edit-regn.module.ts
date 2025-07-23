import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddEditRegnComponent } from './add-edit-regn.component';
import { AddRegnFormModule } from '../add-regn-form/add-regn-form.module';
import { RegnModalDialogueProvider } from '../../provider/regn.provider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastModule } from 'primeng/toast';


@NgModule({
    declarations: [AddEditRegnComponent],
    imports: [
        CommonModule,
        AddRegnFormModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        MatIconModule,
        MatButtonModule,
        ToastModule
    ],
    exports: [AddEditRegnComponent],
    providers: [RegnModalDialogueProvider, ConfirmationService
    ]
})
export class AddRegnModule { }

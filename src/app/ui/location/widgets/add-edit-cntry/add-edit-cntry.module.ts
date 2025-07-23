import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddEditCntryComponent } from './add-edit-cntry.component';
import { AddCntryFormModule } from '../add-cntry-form/add-cntry-form.module';
import { CntryModalDialogueProvider } from '../../provider/cntry.provider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastModule } from 'primeng/toast';


@NgModule({
    declarations: [AddEditCntryComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddCntryFormModule,
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
    exports: [AddEditCntryComponent],
    providers: [CntryModalDialogueProvider, ConfirmationService
    ]
})
export class AddCntryModule { }

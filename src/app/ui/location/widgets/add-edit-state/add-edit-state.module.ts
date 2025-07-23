import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddEditStateComponent } from './add-edit-state.component';
import { StateModalDialogueProvider } from '../../provider/state.provider';
import { AddStateFormModule } from '../add-state-form/add-state-form.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [AddEditStateComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AddStateFormModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        MatIconModule,
        MatButtonModule
    ],
    exports: [AddEditStateComponent],
    providers: [StateModalDialogueProvider, ConfirmationService
    ]
})
export class AddStateModule { }

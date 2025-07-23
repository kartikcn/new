import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddEditRmcatComponent } from './add-edit-rmcat.component';
import { RmcatModalDialogueProvider } from '../../provider/rmcat.provider';
import { AddRmcatItemModule } from '../add-rmcat-item/add-rmcat-item.module';


@NgModule({
    declarations: [AddEditRmcatComponent],
    imports: [
        CommonModule,
        AddRmcatItemModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule
    ],
    exports: [AddEditRmcatComponent],
    providers: [RmcatModalDialogueProvider, ConfirmationService
    ]
})
export class AddEditRmcatDetail { }

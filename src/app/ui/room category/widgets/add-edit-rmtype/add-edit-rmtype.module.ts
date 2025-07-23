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
import { AddEditRmtypeComponent } from './add-edit-rmtype.component';
import { AddRmTypeFormModule } from '../add-rmtype-form/add-rmtype-form.module';


@NgModule({
    declarations: [AddEditRmtypeComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddRmTypeFormModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule
    ],
    exports: [AddEditRmtypeComponent],
    providers: [ConfirmationService
    ]
})
export class AddRmTypeModule { }

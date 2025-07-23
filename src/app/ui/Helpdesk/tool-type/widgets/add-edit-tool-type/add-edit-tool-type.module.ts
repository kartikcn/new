import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditToolTypeComponent } from './add-edit-tool-type.component';
import { AddToolTypeModule } from '../add-tool-type/add-tool-type.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';



@NgModule({
    declarations: [
        AddEditToolTypeComponent
    ],
    imports: [
        CommonModule,
        AddToolTypeModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
    ],
    exports: [AddEditToolTypeComponent],
    providers: [ConfirmationService
    ]
})
export class AddEditToolTypeModule { }

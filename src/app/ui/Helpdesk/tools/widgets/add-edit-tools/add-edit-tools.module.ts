import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditToolsComponent } from './add-edit-tools.component';
import { AddToolsModule } from '../add-tools/add-tools.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';



@NgModule({
    declarations: [
        AddEditToolsComponent
    ],
    imports: [
        CommonModule,
        AddToolsModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
    ],
    exports: [AddEditToolsComponent],
    providers: [ConfirmationService
    ]
})
export class AddEditToolsModule { }

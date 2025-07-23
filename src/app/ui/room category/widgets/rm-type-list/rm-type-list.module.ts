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
import { RmTypeListComponent } from './rm-type-list.component';
import { AddRmTypeModule } from '../add-edit-rmtype/add-edit-rmtype.module';

@NgModule({
    declarations: [RmTypeListComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddRmTypeModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule
    ],
    exports: [RmTypeListComponent],
    providers: []
})
export class RmTypeListModule { }

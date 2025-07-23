import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogComponent } from './confirm-box-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../material/material.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatDialogModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
    ],
    declarations: [ConfirmBoxDialogComponent],
    exports: [ConfirmBoxDialogComponent],
    providers: [ConfirmationService]
})
export class ConfirmBoxDialogModule { }
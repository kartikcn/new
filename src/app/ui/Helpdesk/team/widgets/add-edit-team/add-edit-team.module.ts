import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditTeamComponent } from './add-edit-team.component';
import { AddTeamModule } from '../add-team/add-team.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationService } from 'primeng/api';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
    declarations: [
        AddEditTeamComponent
    ],
    imports: [
        CommonModule,
        AddTeamModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
    ],
    exports: [AddEditTeamComponent],
    providers: [ConfirmationService
    ]
})
export class AddEditTeamModule { }

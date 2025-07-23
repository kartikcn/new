import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { StateListComponent } from './state-list.component';
import { AddStateModule } from '../add-edit-state/add-edit-state.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [StateListComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddStateModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        MatIconModule,
        MatButtonModule,
        PaginatorModule
    ],
    exports: [StateListComponent],
    providers: []
})
export class StateModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserComponent } from './modal/user.component';
import { AddEditUserDetail } from './widgets/add-edit-user/add-edit-user.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [UserComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        AddEditUserDetail,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        PaginatorModule
    ],
    exports: [UserComponent],
    providers: []
})
export class UserModule { }

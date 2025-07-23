import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RmcatComponent } from './modal/rmcat/rmcat.component';
//import { RmcatRoutingModule } from './rmcat-routing';
import { AddEditRmcatDetail } from './widgets/add-edit-rmcat/add-edit-rmcat.module';



@NgModule({
    declarations: [
        RmcatComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddEditRmcatDetail,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        //RmcatRoutingModule
    ],
    exports: [RmcatComponent],
    providers: []
})
export class RmcatModule { }

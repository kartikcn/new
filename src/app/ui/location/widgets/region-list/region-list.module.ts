import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RegionListComponent } from './region-list.component';
import { AddRegnModule } from '../add-edit-regn/add-edit-regn.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
    declarations: [RegionListComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddRegnModule,
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
    exports: [RegionListComponent],
    providers: []
})
export class RegionModule { }

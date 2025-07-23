import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { CityListComponent } from './city-list.component';
import { AddCityModule } from '../add-edit-city/add-edit-city.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [CityListComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddCityModule,
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
    exports: [CityListComponent],
    providers: []
})
export class CityModule { }

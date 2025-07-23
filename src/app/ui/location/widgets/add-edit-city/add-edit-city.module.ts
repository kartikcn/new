import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { AddEditCityComponent } from './add-edit-city.component';
import { AddCityFormModule } from '../add-city-form/add-city-form.module';
import { CityModalDialogueProvider } from '../../provider/city.provider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [AddEditCityComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AddCityFormModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        MatIconModule,
        MatButtonModule
    ],
    exports: [AddEditCityComponent],
    providers: [CityModalDialogueProvider, ConfirmationService
    ]
})
export class AddCityModule { }

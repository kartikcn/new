import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { LocationComponent } from './modal/location.component';
import { AddUserItemModule } from '../user/widgets/add-user-item/add-user-item.module';
import { RegionModule } from './widgets/region-list/region-list.module';
import { AddCntryModule } from './widgets/add-edit-cntry/add-edit-cntry.module';
import { StateModule } from './widgets/state-list/state-list.module';
import { CityModule } from './widgets/city-list/city-list.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [
        LocationComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AddUserItemModule,
        RegionModule,
        AddCntryModule,
        StateModule,
        CityModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        PaginatorModule
    ],
    exports: [LocationComponent],
    providers: []
})
export class LocationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { AllocateDivDepRoomComponent } from './allocate-div-dep-room.component';
import { AllocateDivDepRoomRoutingModule } from './routing/allocate-div-dep-room.routing';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
    declarations: [
        AllocateDivDepRoomComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        PrimeNGModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        AllocateDivDepRoomRoutingModule,
        SvgViewModule,
        ConfirmBoxDialogModule,
        PaginatorModule
    ],
    exports: [AllocateDivDepRoomComponent],
    providers: []
})
export class AllocateDivDepRoomModule { }
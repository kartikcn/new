import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { BackgroundLocComponent } from './modal/background-loc.component';
import { BlListModule } from './widgets/bl-list/bl-list.module';
import { FlListModule } from './widgets/fl-list/fl-list.module';
import { AddBLModule } from './widgets/add-edit-bl/add-edit-bl.module';
import { AddFLModule } from './widgets/add-edit-fl/add-edit-fl.module';
import { RMListModule } from './widgets/rm-list/rm-list.module';
import { AddRMModule } from './widgets/add-edit-rm/add-edit-rm.module';
import { SiteModule } from '../site/site.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';

@NgModule({
    declarations: [
        BackgroundLocComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SiteModule,
        BlListModule,
        FlListModule,
        RMListModule,
        AddBLModule,
        AddFLModule,
        AddRMModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        DirectiveModule
    ],
    exports: [BackgroundLocComponent],
    providers: []
})
export class BackLocModule { }

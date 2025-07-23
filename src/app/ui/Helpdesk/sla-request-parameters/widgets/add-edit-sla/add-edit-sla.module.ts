import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditSlaComponent } from './add-edit-sla.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddSlaRequestModule } from '../add-sla-request/add-sla-request.module';
import { AddSlaResponseModule } from '../add-sla-response/add-sla-response.module';
import { AddEditSlaRoutingModule } from '../../routing/add-edit-sla-routing';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { WrStatusCardsModule } from '../wr-status-cards/wr-status-cards.module';
import { TabViewModule } from 'primeng/tabview';


@NgModule({
    declarations: [
        AddEditSlaComponent
    ],
    imports: [
        CommonModule,
        AddEditSlaRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        PrimeNGModule,
        AddSlaRequestModule,
        AddSlaResponseModule,
        AutoCompleteModule,
        WrStatusCardsModule,
        TabViewModule
    ],
    exports: [AddEditSlaComponent],
    providers: []
})
export class AddEditSlaModule { }

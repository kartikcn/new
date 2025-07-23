import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PmPlannerReqDetailsTableComponent } from './pm-planner-req-details-table.component';
import { AddToolsModule } from 'src/app/ui/Helpdesk/tools/widgets/add-tools/add-tools.module';
import { PartDetailsModule } from 'src/app/ui/common-components/part-details/part-details.module';
import { TradeDetailsModule } from 'src/app/ui/common-components/trade-details/trade-details.module';
import { AddCraftspersonFormModule } from 'src/app/ui/Helpdesk/craftsperson/widgets/add-craftsperson-form/add-craftsperson-form.module';


@NgModule({
    declarations: [PmPlannerReqDetailsTableComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        MatTooltipModule,
        TradeDetailsModule,
        PartDetailsModule,
        AddToolsModule,
        AddCraftspersonFormModule
    ],
    exports: [PmPlannerReqDetailsTableComponent],
    providers: []
})
export class PmPlannerReqDetailsTableModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkRequestDetailsComponent } from './model/work-request-details.component';
import { WorkRequestDetailsRoutingModule } from './routing/work-request-details.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { WorkRequestModule } from '../work-request/work-request.module';
import { RequestLogModule } from './widgets/request-log/request-log.module';
import { WrCommentsModule } from './widgets/wr-comments/wr-comments.module';
import { RequestPartsModule } from './widgets/request-parts/request-parts.module';
import { RequestTechnicianModule } from './widgets/request-technician/request-technician.module';
import { RequestToolsModule } from './widgets/request-tools/request-tools.module';
import { RequestTechnicianLogModule } from './widgets/request-technician-log/request-technician-log.module';
import { RequestOtherCostModule } from './widgets/request-other-cost/request-other-cost.module';
import { BudgetAnalysisModule } from '../budget-analysis/budget-analysis.module';
import { RequestDocumentsModule } from './widgets/request-documents/request-documents.module';
import { DocumentsListModule } from '../../documents-list/documents-list.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequestTradesModule } from './widgets/request-trades/request-trades.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
    declarations: [
        WorkRequestDetailsComponent
    ],
    imports: [
        CommonModule,
        WorkRequestDetailsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MaterialModule,
        PrimeNGModule,
        TabViewModule,
        TimelineModule,
        ProgressSpinnerModule,
        NgxSpinnerModule,
        WorkRequestModule,
        RequestLogModule,
        WrCommentsModule,
        RequestPartsModule,
        RequestTechnicianModule,
        RequestToolsModule,
        RequestTechnicianLogModule,
        RequestOtherCostModule,
        BudgetAnalysisModule,
        RequestDocumentsModule,
        DocumentsListModule,
        NgSelectModule,
        RequestTradesModule,
        MatTooltipModule
    ],
    exports: [WorkRequestDetailsComponent],
    providers: []
})
export class WorkRequestDetailsModule { }

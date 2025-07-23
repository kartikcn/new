import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradesComponent } from './modal/trades.component';
import { TradesRoutingModule } from './routing/trades.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddTradesFormComponent } from './widgets/add-trades-form/add-trades-form.component';
import { AddEditTradesFormComponent } from './widgets/add-edit-trades-form/add-edit-trades-form.component';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [
        TradesComponent,
        AddTradesFormComponent,
        AddEditTradesFormComponent
    ],
    imports: [
        CommonModule,
        TradesRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MaterialModule,
        AntDesignModule,
        PrimeNGModule,
        DirectiveModule,
        MatTooltipModule,
        PaginatorModule
    ],
    exports: [TradesComponent],
    providers: []
})
export class TradesModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { RmcatRmtypeSvgComponent } from './rmcat-rmtype-svg.component';
import { RmcatRmtypeSvgRoutingModule } from './routing/rmcat-rmtype-svg.routing';



@NgModule({
    declarations: [
        RmcatRmtypeSvgComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        PrimeNGModule,
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule,
        RadioButtonModule,
        ToggleButtonModule,
        NgxSpinnerModule,
        RmcatRmtypeSvgRoutingModule,
        SvgViewModule,
        MatTooltipModule,
        PaginatorModule
    ],
    exports: [RmcatRmtypeSvgComponent],
    providers: []
})
export class RmcatRmtypeSvgModule { }
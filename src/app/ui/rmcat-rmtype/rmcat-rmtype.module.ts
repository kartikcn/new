import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { TreeModule } from 'primeng/tree';
import { RmcatRmtypeComponent } from './rmcat-rmtype.component';
import { RmcatRmtypeRoutingModule } from './routing/rmcat-rmtype.routing';
import { AddRmcatFortreeModule } from './widgets/add-rmcat-fortree/add-rmcat-fortree.module';
import { AddRmtypeFortreeModule } from './widgets/add-rmtype-fortree/add-rmtype-fortree.module';



@NgModule({
    declarations: [
        RmcatRmtypeComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        PrimeNGModule,
        RmcatRmtypeRoutingModule,
        TreeModule,
        AddRmcatFortreeModule,
        AddRmtypeFortreeModule
    ],
    exports: [RmcatRmtypeComponent],
    providers: []
})
export class RmCatRmTypeModule { }
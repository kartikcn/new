import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPartsComponent } from './widgets/add-parts/add-parts.component';
import { PartsComponent } from './modal/parts.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { PartsRoutingModule } from './routing/parts.routing';
import { AddEditPartsComponent } from './widgets/add-edit-parts/add-edit-parts.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [
        AddPartsComponent,
        AddEditPartsComponent,
        PartsComponent
    ],
    imports: [
        CommonModule,
        PartsRoutingModule,
        CommonModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MaterialModule,
        AntDesignModule,
        PrimeNGModule,
        SelectButtonModule,
        DirectiveModule,
        PaginatorModule
    ],
    exports: [PartsComponent]
})
export class PartsModule { }
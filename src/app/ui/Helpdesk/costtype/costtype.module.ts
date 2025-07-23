import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CosttypeComponent } from './modal/costtype.component';
import { AddCosttypeComponent } from './widgets/add-costtype/add-costtype.component';
import { AddEditCosttypeComponent } from './widgets/add-edit-costtype/add-edit-costtype.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { CosttypeRoutingModule } from './routing/costtype.routing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';

@NgModule({
    declarations: [
        CosttypeComponent,
        AddCosttypeComponent,
        AddEditCosttypeComponent
    ],
    imports: [
        CommonModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MaterialModule,
        AntDesignModule,
        PrimeNGModule,
        CosttypeRoutingModule,
        MatTooltipModule,
        PaginatorModule,
        DirectiveModule
    ],
    exports: [CosttypeComponent]
})
export class CosttypeModule { }

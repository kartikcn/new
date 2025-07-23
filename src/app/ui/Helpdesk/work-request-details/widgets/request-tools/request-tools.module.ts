import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestToolsComponent } from './request-tools.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MaterialModule } from 'src/app/material/material.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { InputMaskModule } from 'primeng/inputmask';
import { AddRequestToolsComponent } from './widgets/add-request-tools/add-request-tools.component';
import { AddEditRequestToolsComponent } from './widgets/add-edit-request-tools/add-edit-request-tools.component';




@NgModule({
    declarations: [
        RequestToolsComponent,
        AddRequestToolsComponent,
        AddEditRequestToolsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatCardModule,
        MaterialModule,
        AntDesignModule,
        PrimeNGModule,
        SelectButtonModule,
        DirectiveModule,
        InputMaskModule,
    ],
    exports: [RequestToolsComponent],
    providers: []
})
export class RequestToolsModule { }

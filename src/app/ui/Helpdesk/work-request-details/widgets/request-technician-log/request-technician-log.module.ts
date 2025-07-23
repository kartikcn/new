import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestTechnicianLogComponent } from './modal/request-technician-log.component';
import { AddEditRequestTechnicianLogComponent } from './widgets/add-edit-request-technician-log/add-edit-request-technician-log.component';
import { AddRequestTechnicianLogComponent } from './widgets/add-request-technician-log/add-request-technician-log.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MaterialModule } from 'src/app/material/material.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { SelectButtonModule } from 'primeng/selectbutton';



@NgModule({
    declarations: [
        RequestTechnicianLogComponent,
        AddRequestTechnicianLogComponent,
        AddEditRequestTechnicianLogComponent
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
        DirectiveModule
    ],
    exports: [RequestTechnicianLogComponent],
    providers: []
})
export class RequestTechnicianLogModule { }

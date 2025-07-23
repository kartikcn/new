import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestTechnicianComponent } from './model/request-technician.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDialogModule } from '@angular/material/dialog';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MaterialModule } from 'src/app/material/material.module';
import { AddRequestTechniciansComponent } from './widgets/add-request-technicians/add-request-technicians.component';
import { AddEditRequestTechnicianComponent } from './widgets/add-edit-request-technician/add-edit-request-technician.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { InputMaskModule } from 'primeng/inputmask';




@NgModule({
    declarations: [
        RequestTechnicianComponent,
        AddEditRequestTechnicianComponent,
        AddRequestTechniciansComponent
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
    exports: [RequestTechnicianComponent],
    providers: []
})
export class RequestTechnicianModule { }

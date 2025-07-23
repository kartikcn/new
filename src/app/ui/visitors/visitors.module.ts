import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorsComponent } from './modal/visitors.component';
import { VisitorsRoutingModule } from './routing/visitors.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditVisitorsFormComponent } from './widgets/add-edit-visitors/add-edit-visitors-form.component';
import { AddVisitorsFomComponent } from './widgets/add-visitors/add-visitors-fom.component';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
    declarations: [
        VisitorsComponent,
        AddEditVisitorsFormComponent,
        AddVisitorsFomComponent
    ],
    imports: [
        CommonModule,
        VisitorsRoutingModule,
        ConfirmBoxDialogModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MaterialModule,
        PrimeNGModule,
        DirectiveModule,
        PaginatorModule
    ],
    exports: [VisitorsComponent],
    providers: []
})
export class VisitorsModule { }

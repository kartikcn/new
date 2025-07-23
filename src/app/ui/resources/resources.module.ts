import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesComponent } from './modal/resources.component';
import { ResourcesRoutingModule } from './routing/resources-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditResourcesFormModule } from './widgets/add-edit-resources-form/add-edit-resources-form.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
    declarations: [
        ResourcesComponent,
    ],
    imports: [
        CommonModule,
        ResourcesRoutingModule,
        ConfirmBoxDialogModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        DirectiveModule,
        SharedModule,
        MatTooltipModule,
        AddEditResourcesFormModule,
        PaginatorModule
    ],
    exports: [ResourcesComponent],
    providers: []
})
export class ResourcesModule { }

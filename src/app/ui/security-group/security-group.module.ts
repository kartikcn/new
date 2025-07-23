import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityGroupComponent } from './modal/security-group.component';
import { SecurityGroupRoutingModule } from './routing/security-group-routing';
import { AddSecurityGroupFormComponent } from './widgets/add-security-group/add-security-group-form.component';
import { AddEditSecurityGroupFormComponent } from './widgets/add-edit-security-group/add-edit-security-group-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
    declarations: [
        SecurityGroupComponent,
        AddSecurityGroupFormComponent,
        AddEditSecurityGroupFormComponent
    ],
    imports: [
        CommonModule,
        SecurityGroupRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        MatTooltipModule,
        PaginatorModule,
        DirectiveModule
    ],
    exports: [SecurityGroupComponent],
    providers: []
})
export class SecurityGroupModule { }

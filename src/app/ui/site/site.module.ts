import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { SiteComponent } from './modal/site.component';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { SiteRoutingModule } from './site-routing';
import { AddEditSiteComponent } from './widgets/add-edit-site/add-edit-site.component';
import { AddSiteItemComponent } from './widgets/add-site-item/add-site-item.component';
import { ConfirmationService } from 'primeng/api';
import { AntDesignModule } from '../../material/ant-design.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';


@NgModule({
    declarations: [SiteComponent, AddEditSiteComponent, AddSiteItemComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        SiteRoutingModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        AntDesignModule,
        PaginatorModule,
        DirectiveModule
    ],
    exports: [SiteComponent],
    providers: [
        ConfirmationService
    ]
})
export class SiteModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolTypeComponent } from './modal/tool-type.component';
import { ToolTypeRoutingModule } from './routing/tool-type.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditToolTypeModule } from './widgets/add-edit-tool-type/add-edit-tool-type.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
    declarations: [
        ToolTypeComponent,
    ],
    imports: [
        CommonModule,
        ToolTypeRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        AntDesignModule,
        AddEditToolTypeModule,
        MatTooltipModule,
        PaginatorModule
    ],
    exports: [ToolTypeComponent],
    providers: []
})
export class ToolTypeModule { }

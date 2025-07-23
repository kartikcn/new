import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CraftspersonComponent } from './modal/craftsperson.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { CraftspersonRoutingModule } from '../craftsperson/craftsperson-routing';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AddEditCraftspersonModule } from './widgets/add-edit-craftsperson/add-edit-craftsperson.module';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [
        CraftspersonComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        CraftspersonRoutingModule,
        SelectButtonModule,
        DirectiveModule,
        AddEditCraftspersonModule,
        PaginatorModule
    ],
    exports: [CraftspersonComponent],
    providers: []
})
export class CraftspersonModule { }

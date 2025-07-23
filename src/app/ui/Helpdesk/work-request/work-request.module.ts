import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRequestRoutingModule } from './routing/add-work-request.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditWrProblemTypeModule } from './widgets/add-edit-wr-problem-type/add-edit-wr-problem-type.module';
import { AddWorkRequestComponent } from './add-work-request/add-work-request.component';
import { ViewEditWorkRequestModule } from './view-edit-work-request/view-edit-work-request.module';
import { EditWorkRequestComponent } from './edit-work-request/edit-work-request.component';
import { AddWrCommentsModule } from './widgets/add-wr-comments/add-wr-comments.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgViewModule } from '../../svg-view/svg-view.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
@NgModule({
    declarations: [
        AddWorkRequestComponent,
        EditWorkRequestComponent,
    ],
    imports: [
        CommonModule,
        AddRequestRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MaterialModule,
        AntDesignModule,
        PrimeNGModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgxSpinnerModule,
        AddEditWrProblemTypeModule,
        ViewEditWorkRequestModule,
        AddWrCommentsModule,
        RadioButtonModule,
        MatTooltipModule,
        SvgViewModule,
        DirectiveModule
    ],
    exports: [AddWorkRequestComponent],
    providers: []
})

export class WorkRequestModule { }
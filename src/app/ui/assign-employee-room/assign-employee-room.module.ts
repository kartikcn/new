import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { AssignEmployeeRoomComponent } from './assign-employee-room.component';
import { AssignEmployeeRoomRoutingModule } from './routing/assign-employee-room.routing';
import { EmListModule } from '../Helpdesk/work-teams/widgets/em-list/em-list.module';

@NgModule({
    declarations: [
        AssignEmployeeRoomComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MaterialModule,
        PrimeNGModule,
        FormsModule,
        ReactiveFormsModule,
        InputMaskModule,
        DirectiveModule,
        RadioButtonModule,
        ToggleButtonModule,
        NgxSpinnerModule,
        AssignEmployeeRoomRoutingModule,
        SvgViewModule,
        EmListModule
    ],
    exports: [AssignEmployeeRoomComponent],
    providers: []
})
export class AssignEmployeeRoomModule { }
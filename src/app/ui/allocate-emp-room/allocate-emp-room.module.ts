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
import { AllocateEmpRoomComponent } from './allocate-emp-room.component';
import { AllocateEmpRoomRoutingModule } from './routing/allocate-emp-room.routing';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
    declarations: [
        AllocateEmpRoomComponent
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
        AllocateEmpRoomRoutingModule,
        PaginatorModule
    ],
    exports: [AllocateEmpRoomComponent],
    providers: []
})
export class AllocateEmpRoomModule { }
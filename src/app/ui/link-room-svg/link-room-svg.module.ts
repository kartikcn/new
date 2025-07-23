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
import { LinkRoomSvgComponent } from './modal/link-room-svg.component';
import { LinkRoomSvgRoutingModule } from './routing/link-room-svg.routing';
import { AddBLFormModule } from '../background-loc/widgets/add-bl-form/add-bl-form.module';
import { SvgViewModule } from '../svg-view/svg-view.module';

@NgModule({
    declarations: [
        LinkRoomSvgComponent,
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
        LinkRoomSvgRoutingModule,
        AddBLFormModule,
        SvgViewModule
    ],
    exports: [LinkRoomSvgComponent],
    providers: []
})
export class LinkRoomSvgModule { }

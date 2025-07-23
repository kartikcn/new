import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBookingComponent } from './modal/edit-booking.component';
import { EditBookingRoutingModule } from './routing/edit-booking.routing';
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
import { ViewBookingDetailsModule } from './widgets/view-booking-details/view-booking-details.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';




@NgModule({
    declarations: [
        EditBookingComponent
    ],
    imports: [
        CommonModule,
        EditBookingRoutingModule,
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
        ViewBookingDetailsModule,
        MatTooltipModule,
        PaginatorModule,
        DirectiveModule
    ],
    exports: [EditBookingComponent],
    providers: []
})
export class EditBookingModule { }

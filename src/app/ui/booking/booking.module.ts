import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './modal/booking.component';
import { BookingRoutingModule } from './routing/booking.routing';
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
import { ConfirmBookingPageModule } from './widgets/confirm-booking-page/confirm-booking-page.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddRecurrenceDetailsModule } from './widgets/add-recurrence-details/add-recurrence-details.module';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { BookingDetailsViewComponent } from './widgets/booking-details-view/booking-details-view.component';




@NgModule({
    declarations: [
        BookingComponent,
        BookingDetailsViewComponent,
    ],
    imports: [
        CommonModule,
        BookingRoutingModule,
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
        ConfirmBookingPageModule,
        NgxSpinnerModule,
        AddRecurrenceDetailsModule,
        SvgViewModule
    ],
    exports: [BookingComponent],
    providers: []
})
export class BookingModule { }

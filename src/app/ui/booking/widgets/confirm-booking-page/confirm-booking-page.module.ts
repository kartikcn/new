import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBookingPageComponent } from './confirm-booking-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { InputTextModule } from 'primeng/inputtext';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';


@NgModule({
    declarations: [
        ConfirmBookingPageComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        PrimeNGModule,
        AntDesignModule,
        InputTextModule,
        DirectiveModule
    ],
    exports: [ConfirmBookingPageComponent],
    providers: []
})
export class ConfirmBookingPageModule { }

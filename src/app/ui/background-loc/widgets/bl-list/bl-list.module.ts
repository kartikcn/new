import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { BlListComponent } from './bl-list.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [BlListComponent],
    imports: [
        CommonModule,
        PrimeNGModule,
        PaginatorModule
    ],
    exports: [BlListComponent],
    providers: [
        ConfirmationService
    ]
})
export class BlListModule { }

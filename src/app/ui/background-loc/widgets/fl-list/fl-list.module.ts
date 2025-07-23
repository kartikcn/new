import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FlListComponent } from './fl-list.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [FlListComponent],
    imports: [
        CommonModule,
        PrimeNGModule,
        PaginatorModule
    ],
    exports: [FlListComponent],
    providers: []
})
export class FlListModule { }

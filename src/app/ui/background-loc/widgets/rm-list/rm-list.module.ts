import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RmListComponent } from './rm-list.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    declarations: [RmListComponent],
    imports: [
        CommonModule,
        PrimeNGModule,
        PaginatorModule
    ],
    exports: [RmListComponent],
    providers: []
})
export class RMListModule { }

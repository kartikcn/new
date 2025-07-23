import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrCommentsComponent } from './wr-comments.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
    declarations: [
        WrCommentsComponent
    ],
    imports: [
        CommonModule,
        PrimeNGModule
    ],
    exports: [WrCommentsComponent],
    providers: []
})
export class WrCommentsModule { }

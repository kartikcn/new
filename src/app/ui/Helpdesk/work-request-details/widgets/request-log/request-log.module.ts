import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestLogComponent } from './modal/request-log.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        RequestLogComponent
    ],
    imports: [
        CommonModule,
        PrimeNGModule,
        FormsModule,
        MatTooltipModule
    ],
    exports: [RequestLogComponent],
    providers: []
})
export class RequestLogModule { }

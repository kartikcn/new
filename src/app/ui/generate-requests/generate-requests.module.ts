import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateRequestsComponent } from './modal/generate-requests.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { GenerateRequestsRoutingModule } from './routing/generate-requests-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ShowRquestDetailsModule } from './widgets/show-rquest-details/show-rquest-details.module';



@NgModule({
  declarations: [
    GenerateRequestsComponent
  ],
  imports: [
    CommonModule,
    GenerateRequestsRoutingModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    ShowRquestDetailsModule
  ]
})
export class GenerateRequestsModule { }

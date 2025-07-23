import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestDocumentsComponent } from './modal/request-documents.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddRequestDocumentsModule } from './widgets/add-request-documents/add-request-documents.module';

@NgModule({
  declarations: [
    RequestDocumentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    AddRequestDocumentsModule
  ],
  exports: [RequestDocumentsComponent],
})
export class RequestDocumentsModule { }

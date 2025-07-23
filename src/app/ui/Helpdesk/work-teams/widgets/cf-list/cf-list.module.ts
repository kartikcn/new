import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CfListComponent } from './cf-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    CfListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
    PaginatorModule
  ],
  exports:[CfListComponent]
})
export class CfListModule { }

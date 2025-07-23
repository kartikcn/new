import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RolesListComponent } from './roles-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { EmstdListComponent } from './emstd-list.component';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    EmstdListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
    PaginatorModule
  ],
  exports:[EmstdListComponent]
})
export class EmStdListModule { }

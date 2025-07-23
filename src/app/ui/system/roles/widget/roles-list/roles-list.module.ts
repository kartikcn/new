import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesListComponent } from './roles-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    RolesListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
    PaginatorModule
  ],
  exports:[RolesListComponent]
})
export class RolesListModule { }

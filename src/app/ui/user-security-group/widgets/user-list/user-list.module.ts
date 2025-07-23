import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
    PaginatorModule
  ],
  exports:[UserListComponent]
})
export class UserListModule { }

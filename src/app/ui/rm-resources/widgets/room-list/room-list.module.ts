import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomListComponent } from './room-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    RoomListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
   PaginatorModule
  ],
  
  exports: [RoomListComponent]
})
export class RoomListModule { }

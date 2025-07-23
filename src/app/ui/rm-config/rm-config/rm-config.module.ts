import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RmConfigComponent } from './modal/rm-config.component';
import { RmConfigRoutingModule } from './routing/rm-config.routing';
import { RoomListModule } from '../../rm-resources/widgets/room-list/room-list.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { RmConfigFormModule } from './widgets/rm-config-form/rm-config-form.module';
import { RmConfigListComponent } from './widgets/rm-config-list/rm-config-list.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RmConfigComponent,
    RmConfigListComponent,
  ],
  imports: [
    CommonModule,
    RmConfigRoutingModule,
    RoomListModule,
    PrimeNGModule,
    RmConfigFormModule,
    AntDesignModule,
    FormsModule
  ]
})
export class RmConfigModule { }

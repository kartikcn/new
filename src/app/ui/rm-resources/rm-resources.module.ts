import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RmResourcesComponent } from './modal/rm-resources.component';
import { RmResourcesRoutingModule } from './routing/rm-resources.routing';
import { ResourceAssignScreenModule } from './widgets/resource-assign-screen/resource-assign-screen.module';
import { ResourrceUnassignScreenModule } from './widgets/resourrce-unassign-screen/resourrce-unassign-screen.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RoomListModule } from './widgets/room-list/room-list.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { RmResourcesFormModule } from './widgets/rm-resources-form/rm-resources-form.module';



@NgModule({
  declarations: [
    RmResourcesComponent,
   
  ],
  imports: [
    CommonModule,
    RmResourcesRoutingModule,
    RoomListModule,
    ResourrceUnassignScreenModule,
    ResourceAssignScreenModule,
    PrimeNGModule,
    AntDesignModule,
    RmResourcesFormModule
    
    
  ]
})
export class RmResourcesModule { }

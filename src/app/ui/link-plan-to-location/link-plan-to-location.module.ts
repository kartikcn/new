import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkPlanToLocationComponent } from './modal/link-plan-to-location.component';
import { LinkPlanToLocationRoutingModule } from './routing/link-plan-to-location/link-plan-to-location-routing.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { LinkPlanToLocationScreenModule } from './widgets/link-plan-to-location-screen/link-plan-to-location-screen.module';
import { UnLinkPlanToLocationScreenModule } from './widgets/un-link-plan-to-location-screen/un-link-plan-to-location-screen.module';
import { RoomListModule } from '../rm-resources/widgets/room-list/room-list.module';
import { PpmPlansListModule } from './widgets/ppm-plans-list/ppm-plans-list.module';
import { LocationPlanListModule } from './widgets/location-plan-list/location-plan-list.module';



@NgModule({
  declarations: [
    LinkPlanToLocationComponent
  ],
  imports: [
    CommonModule,
    LinkPlanToLocationRoutingModule,
    LinkPlanToLocationScreenModule,
    UnLinkPlanToLocationScreenModule,
    RoomListModule,
    PrimeNGModule,
    PpmPlansListModule,
    LocationPlanListModule
  ]
})
export class LinkPlanToLocationModule { }

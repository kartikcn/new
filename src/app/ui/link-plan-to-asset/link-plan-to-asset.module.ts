import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkPlanToAssetComponent } from './modal/link-plan-to-asset.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { LinkPlanToLocationScreenModule } from '../link-plan-to-location/widgets/link-plan-to-location-screen/link-plan-to-location-screen.module';
import { UnLinkPlanToLocationScreenModule } from '../link-plan-to-location/widgets/un-link-plan-to-location-screen/un-link-plan-to-location-screen.module';
import { LinkPlanToAssetRoutingModule } from './routing/link-plan-to-asset-routing';
import { AssetListModule } from './widgets/asset-list/asset-list.module';



@NgModule({
  declarations: [
    LinkPlanToAssetComponent
  ],
  imports: [
    CommonModule,
    LinkPlanToAssetRoutingModule,
    LinkPlanToLocationScreenModule,
    UnLinkPlanToLocationScreenModule,
    AssetListModule,
    PrimeNGModule
  ]
})
export class LinkPlanToAssetModule { }

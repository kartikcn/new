import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkAssetsToPlanComponent } from './modal/link-assets-to-plan.component';
import { PpmPlansListModule } from '../link-plan-to-location/widgets/ppm-plans-list/ppm-plans-list.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { LinkAssetsToPlanRoutingModule } from './routing/link-assets-to-plan.routing';
import { LinkAssetsScreenModule } from './widgets/link-assets-screen/link-assets-screen.module';
import { UnLinkAssetsScreenModule } from './widgets/un-link-assets-screen/un-link-assets-screen.module';



@NgModule({
  declarations: [
    LinkAssetsToPlanComponent
  ],
  imports: [
    CommonModule,
    PpmPlansListModule,
    LinkAssetsToPlanRoutingModule,
    UnLinkAssetsScreenModule,
    LinkAssetsScreenModule,
    PrimeNGModule
  ]
})
export class LinkAssetsToPlanModule { }

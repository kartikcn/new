import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkPlanToAssetComponent } from '../modal/link-plan-to-asset.component';

const routes: Routes = [
  { path: '', component: LinkPlanToAssetComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkPlanToAssetRoutingModule { }

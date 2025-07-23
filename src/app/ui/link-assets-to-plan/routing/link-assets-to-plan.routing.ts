import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkAssetsToPlanComponent } from '../modal/link-assets-to-plan.component';

const routes: Routes = [
  { path: '', component: LinkAssetsToPlanComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkAssetsToPlanRoutingModule { }

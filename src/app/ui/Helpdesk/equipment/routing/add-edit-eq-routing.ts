import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentComponent } from '../modal/equipment.component';
import { AssetDetailsComponent } from '../asset-details/asset-details.component';

const routes: Routes = [
  { path: '', component: AssetDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetDetailsRoutingModule { }

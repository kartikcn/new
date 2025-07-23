import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradesComponent } from '../modal/trades.component';

const routes: Routes = [
  { path: '', component: TradesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradesRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EqStdComponent } from '../modal/eq-std.component';

const routes: Routes = [
  { path: '', component: EqStdComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EqStdRoutingModule { }

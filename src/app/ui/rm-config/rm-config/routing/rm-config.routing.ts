import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RmConfigComponent } from '../modal/rm-config.component';



const routes: Routes = [
  { path: '', component: RmConfigComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RmConfigRoutingModule { }

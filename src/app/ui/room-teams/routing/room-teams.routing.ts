import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomTeamsComponent } from '../room-teams.component';


const routes: Routes = [
  { path: '', component: RoomTeamsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomTeamsRoutingModule { }
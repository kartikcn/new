import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RoomTeamsComponent } from './room-teams.component';
import { RoomTeamsRoutingModule } from './routing/room-teams.routing';
import { TeamListModule } from './widgets/team-list/team-list.module';
import { UnAssignRoomsModule } from './widgets/unassign-rooms/unassign-rooms.module';
import { AssignRoomsModule } from './widgets/assign-rooms/assign-room.module';


@NgModule({
  declarations: [
    RoomTeamsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    RoomTeamsRoutingModule,
    TeamListModule,
    UnAssignRoomsModule,
    AssignRoomsModule
  ]
})
export class RoomTeamsModule { }

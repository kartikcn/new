import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignRoomsComponent } from './widgets/assign-rooms/assign-rooms.component';
import { UnassignRoomsComponent } from './widgets/unassign-rooms/unassign-rooms.component';

@Component({
  selector: 'app-room-teams',
  templateUrl: './room-teams.component.html',
  styleUrls: ['./room-teams.component.scss']
})
export class RoomTeamsComponent implements OnInit {
  selectedteamId: string = '';
  // showPanels :boolean = false;
  @ViewChild(AssignRoomsComponent) assignSgPanel!: AssignRoomsComponent;
  @ViewChild(UnassignRoomsComponent) unAssignSgPanel!: UnassignRoomsComponent;
  constructor() { }

  ngOnInit(): void {
  }

  getData(event:any){
    this.selectedteamId = event.data.teamId;
    // this.showPanels = true;
    this.assignSgPanel.loadRecords(this.selectedteamId);
    this.unAssignSgPanel.loadRecords(this.selectedteamId);
  }

  refreshPanels(event:any){
    if (event === true) {
      this.assignSgPanel.loadRecords(this.selectedteamId);
      this.unAssignSgPanel.loadRecords(this.selectedteamId);
    }
  }

}

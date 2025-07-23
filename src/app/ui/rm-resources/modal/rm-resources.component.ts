import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { RmResourcesDialogueProvider } from '../provider/rm-resources.provider';
import { RmResourcesService } from '../service/rm-resources.service';
import { ResourceAssignScreenComponent } from '../widgets/resource-assign-screen/resource-assign-screen.component';
import { ResourceUnassignScreenComponent } from '../widgets/resourrce-unassign-screen/resource-unassign-screen.component';

@Component({
  selector: 'app-rm-resources',
  templateUrl: './rm-resources.component.html',
  styleUrls: ['./rm-resources.component.scss'],
  providers: [MessageService]
})
export class RmResourcesComponent implements OnInit {
  @ViewChild(ResourceAssignScreenComponent, { static: false }) ResourceAssignScreenPanel!: ResourceAssignScreenComponent;
  @ViewChild(ResourceUnassignScreenComponent, { static: false }) ResourceUnAssignScreenPanel!: ResourceUnassignScreenComponent;
  blId!: number;
  flId!: number;
  rmId!: number;
  resourcesId!: number;
  myEvent!: any;


  constructor(
    private rmResourcesSrv: RmResourcesService,
    private rmResourceProvider: RmResourcesDialogueProvider,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

  getUnAssignedResources(event: any) {
    this.myEvent = event;
    this.ResourceAssignScreenPanel.blId = event.data.blId;
    this.ResourceAssignScreenPanel.flId = event.data.flId;
    this.ResourceAssignScreenPanel.rmId = event.data.rmId;

    this.ResourceUnAssignScreenPanel.roomDetails = " " +'  to ' + event.data.rmName;

    this.ResourceUnAssignScreenPanel.blId = event.data.blId;
    this.ResourceUnAssignScreenPanel.flId = event.data.flId;
    this.ResourceUnAssignScreenPanel.rmId = event.data.rmId;
    this.ResourceUnAssignScreenPanel.selectedScreens = [];

    let data = {
      blId: event.data.blId,
      flId: event.data.flId,
      rmId: event.data.rmId,
    }
    this.rmResourcesSrv.getUnAssignedResources(data).subscribe((res: any) => {
      this.ResourceAssignScreenPanel.unAssignedResources = res;

    });

    this.rmResourcesSrv.getAssignedResources(data).subscribe((res: any) => {
      this.ResourceUnAssignScreenPanel.AssignedResources = res;
    })
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      blId: this.blId,
      flId: this.flId,
      rmId: this.rmId
    };
    this.rmResourceProvider.openDialog(dialogConfig);
    this.rmResourceProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'rmResource', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
      }
    });
  }
  refreshPanels(event: string) {
    if (event === "true") {
      this.getUnAssignedResources(this.myEvent);
    }

  }

}

import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LinkPlanToLocationScreenComponent } from '../../link-plan-to-location/widgets/link-plan-to-location-screen/modal/link-plan-to-location-screen.component';
import { UnLinkPlanToLocationScreenComponent } from '../../link-plan-to-location/widgets/un-link-plan-to-location-screen/modal/un-link-plan-to-location-screen.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-link-plan-to-asset',
  templateUrl: './link-plan-to-asset.component.html',
  styleUrls: ['./link-plan-to-asset.component.scss'],
  providers: [MessageService]
})
export class LinkPlanToAssetComponent {
  compId!: number;
  blId!: string;
  flId!: string;
  rmId!: string;
  resourcesId!: number;
  myEvent!: any;

  @ViewChild(LinkPlanToLocationScreenComponent, { static: false }) linkPlanToLocationScreenComponent!: LinkPlanToLocationScreenComponent;
  @ViewChild(UnLinkPlanToLocationScreenComponent, { static: false }) unLinkPlanToLocationScreenComponent!: UnLinkPlanToLocationScreenComponent;


  constructor(
    private authSrv: AuthService,
    // private rmResourcesSrv: RmResourcesService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

  getUnAssignedResources(event: any) {
    this.myEvent = event;
    let data = {
      blId: event.data.blId,
      flId: event.data.flId,
      rmId: event.data.rmId,
      eqId: event.data.eqId ? event.data.eqId : null,
      planType: "Asset" // plantype enumKey
    }

    this.linkPlanToLocationScreenComponent.selectedRoom = " " + event.data.eqCode;
    this.unLinkPlanToLocationScreenComponent.selectedRoom = " " + event.data.eqCode;
    this.linkPlanToLocationScreenComponent.loadRecords(data);
    this.unLinkPlanToLocationScreenComponent.loadRecords(data);
  }

  refreshPanels(event: any) {
    if (event) {
      this.getUnAssignedResources(this.myEvent);
    }
  }


}

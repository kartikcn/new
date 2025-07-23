import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LinkPlanToLocationScreenComponent } from '../widgets/link-plan-to-location-screen/modal/link-plan-to-location-screen.component';
import { UnLinkPlanToLocationScreenComponent } from '../widgets/un-link-plan-to-location-screen/modal/un-link-plan-to-location-screen.component';
import { AuthService } from 'src/app/services/auth.service';
import { LocationPlanListComponent } from '../widgets/location-plan-list/modal/location-plan-list.component';
import { PpmPlansListComponent } from '../widgets/ppm-plans-list/ppm-plans-list.component';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-link-plan-to-location',
  templateUrl: './link-plan-to-location.component.html',
  styleUrls: ['./link-plan-to-location.component.scss'],
  providers: [MessageService]
})
export class LinkPlanToLocationComponent {
  blId!: string;
  flId!: string;
  rmId!: string;
  resourcesId!: number;
  myEvent!: any;
  showChild: boolean = false;
  useTabletProtrait = false;
  @ViewChild(LinkPlanToLocationScreenComponent, { static: false }) linkPlanToLocationScreenComponent!: LinkPlanToLocationScreenComponent;
  @ViewChild(UnLinkPlanToLocationScreenComponent, { static: false }) unLinkPlanToLocationScreenComponent!: UnLinkPlanToLocationScreenComponent;
  @ViewChild(LocationPlanListComponent ,{static:false}) locationPlanListComponent!:LocationPlanListComponent;
  @ViewChild(PpmPlansListComponent, {static: false}) ppmPlansListComponent!:PpmPlansListComponent;
  constructor(
    private authSrv: AuthService,
    private messageService: MessageService,
    private bps : BreakpointService,
    private cdr : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadRecords();
  }

  ngAfterViewInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.ppmPlansListComponent.loadRecords("Location");
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.cdr.detectChanges();
    this.ngAfterViewInit();
  }

  getUnAssignedResources(event: any) {
    this.myEvent = event;
    let data = {
      blId: event.data.blId,
      flId: event.data.flId,
      rmId: event.data.rmId,
      eqId: event.data.eqId ? event.data.eqId : null,
      planType: "Location"
    }

    this.linkPlanToLocationScreenComponent.selectedRoom = " " + event.data.rmName;
    this.unLinkPlanToLocationScreenComponent.selectedRoom = " " + event.data.rmName;
    this.linkPlanToLocationScreenComponent.loadRecords(data);
    this.unLinkPlanToLocationScreenComponent.loadRecords(data);
  }

  getLocationsPlans(event:any) {
    this.showChild = true;
    this.locationPlanListComponent.header = "Linked Locations for - " +event.planName
    this.locationPlanListComponent.loadLocationPlans(event.planId);
  }

  refreshPanels(event: any) {
    if (event) {
      this.getUnAssignedResources(this.myEvent);
    }
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

}

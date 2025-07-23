import { Component, ViewChild } from '@angular/core';
import { PpmPlansListComponent } from '../../link-plan-to-location/widgets/ppm-plans-list/ppm-plans-list.component';
import { UnLinkAssetsScreenComponent } from '../widgets/un-link-assets-screen/un-link-assets-screen.component';
import { LinkAssetsScreenComponent } from '../widgets/link-assets-screen/link-assets-screen.component';

@Component({
  selector: 'app-link-assets-to-plan',
  templateUrl: './link-assets-to-plan.component.html',
  styleUrls: ['./link-assets-to-plan.component.scss']
})
export class LinkAssetsToPlanComponent {
  selectedPlan: any;
  @ViewChild(PpmPlansListComponent, { static: false }) ppmPlansListComponent!: PpmPlansListComponent;
  @ViewChild(LinkAssetsScreenComponent, { static: false }) linkAssetsScreenComponent!: LinkAssetsScreenComponent;
  @ViewChild(UnLinkAssetsScreenComponent, { static: false }) unLinkAssetsScreenComponent!: UnLinkAssetsScreenComponent;
  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.ppmPlansListComponent.loadRecords("Asset");
  }

  getPlanAssets(event: any) {
    // this.showChild = true;
    // this.locationPlanListComponent.header = "Linked Locations for - " +event.planName
    // this.locationPlanListComponent.loadLocationPlans(event.planId);
    this.selectedPlan = event;
    this.linkAssetsScreenComponent.selectedPlan = `( ${event.planName} )`;
    this.unLinkAssetsScreenComponent.selectedPlan = `( ${event.planName} )`;
    this.linkAssetsScreenComponent.loadRecords(event.planId);
    this.unLinkAssetsScreenComponent.loadRecords(event.planId);
  }

  refreshPanels(event: any) {
    this.linkAssetsScreenComponent.selectedPlan = `( ${this.selectedPlan.planName} )`;
    this.unLinkAssetsScreenComponent.selectedPlan = `( ${this.selectedPlan.planName} )`;
    this.linkAssetsScreenComponent.loadRecords(this.selectedPlan.planId);
    this.unLinkAssetsScreenComponent.loadRecords(this.selectedPlan.planId);
  }

}

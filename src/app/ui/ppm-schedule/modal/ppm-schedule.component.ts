import { Component, ViewChild } from '@angular/core';
import { PpmScheduleTypeComponent } from '../widgets/ppm-schedule-type/ppm-schedule-type.component';
import { PpmScheduleTypeListComponent } from '../widgets/ppm-schedule-type-list/ppm-schedule-type-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanLocAssetListComponent } from '../widgets/plan-loc-asset-list/plan-loc-asset-list.component';

@Component({
  selector: 'app-ppm-schedule',
  templateUrl: './ppm-schedule.component.html',
  styleUrls: ['./ppm-schedule.component.scss']
})
export class PpmScheduleComponent {
  @ViewChild(PpmScheduleTypeComponent, { static: false }) ppmScheduleTypeComponent!: PpmScheduleTypeComponent;
  @ViewChild(PpmScheduleTypeListComponent, { static: false }) ppmScheduleTypeListComponent!: PpmScheduleTypeListComponent;
  @ViewChild(PlanLocAssetListComponent, { static: false }) planLocAssetListComponent!: PlanLocAssetListComponent;
  planLocEqId: number = 0
  showChild: boolean = false;
  planId:any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params.planId != null) {
        this.planId = params.planId;
      } else {
        this.planId = null;
      }
    });
  }
  ngOnInit() {
   
  }
  ngAfterViewInit() {
    if(this.planId){
      this.planLocAssetListComponent.getPlanLocAssetByPlanId(this.planId);
    } else {
      this.planLocAssetListComponent.loadData();
    }
  }
  onRowSelect(event: any) {
    let gridTitle = `Plan Schedule Details For ( ${event.data.blName} | ${event.data.flName} | ${event.data.rmName} `;
    gridTitle =   event.data.eqId ? `${gridTitle} | ${event.data.eqCode} )` : `${gridTitle} )`;
    this.router.navigate(['/schedule-details'], {
      queryParams: {
        planLocEqId: event.data.planLocEqId, gridTitle: gridTitle,planId:this.planId
      },skipLocationChange:true
    })
  }

}

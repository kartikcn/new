import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { PpmPlanService } from 'src/app/ui/ppm-plan/services/ppm-plan-services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-forecast-plan-details',
  templateUrl: './forecast-plan-details.component.html',
  styleUrls: ['./forecast-plan-details.component.scss'],
  providers: [MessageService]
})
export class ForecastPlanDetailsComponent {
  enumList: Enums[] = [];
  enumPlanData: Enums[] = [];
  //planData: any[] = [];
  isHide: Boolean = true;
  loading: boolean = false;
  value: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  locTypeId: any = 0;
  planLocEqId:number = 0;
  planId:number = 0;
  selectedPlan:any;
  activeIndex: number = 0;
  hideBackButton:boolean = true;
  @Output() parentFun = new EventEmitter();
  @Input() planData: any[] = [];
  constructor(
    private enumsrv: EnumService,
    private ppmPlanService: PpmPlanService,
    private router: Router,
    private authSrv: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.loadEnums();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumPlanData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plans'.toLocaleUpperCase()
          && t.fieldName.toLowerCase() === 'plan_type'.toLowerCase());
        this.enumPlanData.forEach(t => t.enumValue.toLocaleLowerCase() === "Location".toLocaleLowerCase() ? this.locTypeId = t.id : '')
        // this.enumPlanData.unshift(new Enums(null, "", "", 'Make a selection'));
      },
      error => {
      }
    );
  }

  getEnumByById(id: any) {
    return id ? this.enumPlanData.find(t => t.id == id) != null ? this.enumPlanData.find(t => t.id == id)?.enumValue : '' : '';
  }

  setPlanData(planData: any) {
    this.planData = planData;
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event.data);
  }

  openEditItem(plan: any) {
    
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(["/plan-details"], { queryParams: { planId: planId, } })
    // );

    // window.open(url, '_blank');
    this.planId = 0;
    this.selectedPlan = null;
    this.selectedPlan = plan.plan;
    this.planId = plan.planId;
    this.activeIndex = 1;
  }

  viewSchedules(event: any) {
    // let gridTitle = `Plan Schedule Details For ( ${event.blId} | ${event.flId} | ${event.rmId} `;
    // gridTitle =   event.eqId ? `${gridTitle} | ${event.eqId} )` : `${gridTitle} )`;
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/schedule-details'], { queryParams: {
    //     planLocEqId: event.planLocEqId, gridTitle: gridTitle,planId:event.plan.planId
    //   } })
    // );

    // window.open(url, '_blank');
    this.planLocEqId = 0
   this.planLocEqId = event.planLocEqId;
   this.activeIndex = 2;
  }

  handleChange(event: any) {
   console.log(event);
   if(event.index == 0) {
    this.planId = 0;
    this.planLocEqId = 0;
    this.selectedPlan = null;
   }
  }

}

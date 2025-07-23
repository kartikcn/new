import { Component, EventEmitter, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { PpmPlanService } from 'src/app/ui/ppm-plan/services/ppm-plan-services';
import { UtilConstant } from 'src/common/UtilConstant';
import { LinkPlanToLocationOrAssetService } from '../../../services/link-plan-to-location.services';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-un-link-plan-to-location-screen',
  templateUrl: './un-link-plan-to-location-screen.component.html',
  styleUrls: ['./un-link-plan-to-location-screen.component.scss']
})
export class UnLinkPlanToLocationScreenComponent {
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumPlanData: Enums[] = [];
  planData: any[] = [];
  selectedScreens: any[] = [];
  isHide: Boolean = true;
  loading: boolean = false;
  value: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedRoom: String = '';
  selectedEvent: any;
  compId:number = 0;
  @Output() parentFun = new EventEmitter();
  constructor(
    private enumsrv: EnumService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private linkPlanToLocationOrAssetSrv: LinkPlanToLocationOrAssetService,
    private authSrv:AuthService
  ) {
  }

  ngOnInit(): void {
   // this.loadEnums();
    this.compId = this.authSrv.getLoggedInUserCompId();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumPlanData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plans'.toLocaleUpperCase() && t.fieldName.toLowerCase() === 'plan_type'.toLowerCase());
        this.enumPlanData.unshift(new Enums(null, "", "", 'Make a selection'));
      },
      error => {
        // this.loginError = error.errorDesc;
      }
    );
  }

  getEnumByById(id: any) {
    return id ? this.enumPlanData.find(t => t.id == id) != null ? this.enumPlanData.find(t => t.id == id)?.enumValue : '' : '';
  }

  loadRecords(data:any) {
    this.loading = true;
    this.planData = [];
    this.selectedScreens = [];
    this.selectedEvent = data;
    this.linkPlanToLocationOrAssetSrv.getLinkedPlansForLocation(data).subscribe((res: any) => {
      if (res.status != 202) {
        this.planData = res;
      }
      else {
        this.planData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onUnLink() {
    let selectedPlansList: any[] = [];
    this.selectedScreens.map(plan => {
      const data = {
        planLocEqId: 0,
        planId: plan.planId,
        blId:this.selectedEvent.blId,
        flId:this.selectedEvent.flId,
        rmId:this.selectedEvent.rmId,
        eqId:this.selectedEvent.eqId ? this.selectedEvent.eqId  : null,
        compId: this.compId,
      }
      selectedPlansList.push(data);
    })
    this.linkPlanToLocationOrAssetSrv.delete(selectedPlansList).subscribe((res: any) => {
      this.messageService.clear();
      if (res.length >= 0) {
        this.messageService.add({ key: 'unLinkGrid', severity: 'success', summary: 'Plan(s) Un Linked successfully', detail: 'Plan(s) are successfully unlinked except for those that contain schedules.' });
        this.refreshPanel();
      }

    })
  }

  refreshPanel() {
    this.parentFun.emit(true)
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.UN_LINK_PLANS_CONFIRMATION,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       this.onUnLink();
      },
      key:"unLinkGrid"
    });
  }

}

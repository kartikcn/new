import { Component, EventEmitter, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { PpmPlanService } from 'src/app/ui/ppm-plan/services/ppm-plan-services';
import { UtilConstant } from 'src/common/UtilConstant';
import { LinkPlanToLocationOrAssetService } from '../../../services/link-plan-to-location.services';
import { AuthService } from 'src/app/services/auth.service';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-link-plan-to-location-screen',
  templateUrl: './link-plan-to-location-screen.component.html',
  styleUrls: ['./link-plan-to-location-screen.component.scss'],
  providers: [MessageService]
})
export class LinkPlanToLocationScreenComponent {
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumPlanData: EnumList[] = [];
  planData: any[] = [];
  selectedScreens: any[] = [];
  isHide: Boolean = true;
  loading: boolean = false;
  value: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedRoom:String = '';
  compId:number = 0;
  selectedEvent:any;

  @Output() parentFun= new EventEmitter();
  constructor(
    private enumsrv: EnumService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private linkPlanToLocationOrAssetService:LinkPlanToLocationOrAssetService,
    private authSrv:AuthService
  ) {
  }

  ngOnInit(): void {
   // this.loadEnums();
    // this.compId = this.authSrv.getLoggedInUserCompId();
    //this.loadRecords();
    this.loadData();
  }
  loadData() {
    this.linkPlanToLocationOrAssetService.getAll().subscribe((res: any) => {
      console.log(res);
    })
  }
  

  getEnumByById(enumKey: any) {
    return enumKey ? this.enumPlanData.find(t => t.enumKey == enumKey) != null ? this.enumPlanData.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }

  loadRecords(data:any) {
    this.loading = true;
    this.planData = [];
    this.selectedScreens = [];
    this.selectedEvent = data;
    this.linkPlanToLocationOrAssetService.getUnLinkedPlansForLocation(data).subscribe((res: any) => {
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

  onLink() {
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
    this.linkPlanToLocationOrAssetService.save(selectedPlansList).subscribe((res: any) => {
      this.messageService.clear();
      if (res.code === 200) {
        this.messageService.add({ key: 'linkGrid', severity: 'success', summary: 'Record(s) Linked successfully', detail: 'Record(s) Linked successfully' });
        this.refreshPanel();
      }
    })
  }

  refreshPanel() {
    this.parentFun.emit(true)
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.LINK_PLANS_CONFIRMATION,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       this.onLink();
      },
      key:"linkGrid"
    });
   
  }

}

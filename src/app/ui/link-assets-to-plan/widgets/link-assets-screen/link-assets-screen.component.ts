import { Component, EventEmitter, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { EquipmentService } from 'src/app/ui/Helpdesk/equipment/services/equipment.services';
import { LinkPlanToLocationOrAssetService } from 'src/app/ui/link-plan-to-location/services/link-plan-to-location.services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-link-assets-screen',
  templateUrl: './link-assets-screen.component.html',
  styleUrls: ['./link-assets-screen.component.scss'],
  providers: [MessageService]
})
export class LinkAssetsScreenComponent {
  eqData: any[] = [];
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedPlan: string = '';
  selectedScreens: any[] = [];
  compId: number = 0;
  planId: number = 0;
  @Output() parentFun = new EventEmitter();

  constructor(
    private eqService: EquipmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private linkPlanToLocationOrAssetService: LinkPlanToLocationOrAssetService,
    private authSrv: AuthService
  ) { }

  ngOnInit(): void {
    // this.loadRecords();
    this.compId = this.authSrv.getLoggedInUserCompId();
  }

  loadRecords(planId: any) {
    this.loading = true;
    this.planId = planId;
    this.eqData = [];
    this.selectedScreens = [];
    this.eqService.getUnLinkedEquipmentPlanId(planId).subscribe((res: any) => {
      if (res.status != 202) {
        this.eqData = res;
      }
      else {
        this.eqData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event);
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.LINK_ASSETS_CONFIRMATION,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onLink();
      },
      key: "linkGrid"
    });

  }

  onLink() {
    let selectedPlansList: any[] = [];
    this.selectedScreens.map(asset => {
      const data = {
        planLocEqId: 0,
        planId: this.planId,
        blId: asset.blId,
        flId: asset.flId,
        rmId: asset.rmId,
        eqId: asset.eqId,
      }
      selectedPlansList.push(data);
    })
    this.linkPlanToLocationOrAssetService.save(selectedPlansList).subscribe((res: any) => {
      this.messageService.clear();
      if (res.code === 200) {
        this.messageService.add({ key: 'linkGrid', severity: 'success', summary: 'Record(s) Linked successfully', detail: 'Record(s) Linked successfully' });
        this.refreshPanel();
        this.selectedScreens = [];
      }
    })
  }

  refreshPanel() {
    this.parentFun.emit(true);
  }
}

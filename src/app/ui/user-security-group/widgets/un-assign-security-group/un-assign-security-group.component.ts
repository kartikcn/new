import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SgServices } from 'src/app/ui/security-group/services/securityGroup.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-un-assign-security-group',
  templateUrl: './un-assign-security-group.component.html',
  styleUrls: ['./un-assign-security-group.component.scss'],
  providers: [MessageService]
})
export class UnAssignSecurityGroupComponent implements OnInit {
  rowCount: number = UtilConstant.ROW_COUNT;
  Sg_data: any[] = [];
  selectedScreens: any[] = [];
  userId: number = 0;
  userRoleId: number = 0;
  @Output() unAssignSgPanels = new EventEmitter();
  constructor(
    private sgService: SgServices,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {

  }

  loadRecords(data: any) {
    this.Sg_data = [];
    this.selectedScreens = [];
    this.userId = data.userId;
    this.userRoleId = data.userRoleId;
    this.sgService.getAssignedSg(data).subscribe((res: any) => {
      this.Sg_data = res;
    })
  }

  onUnAssign() {
    let selectedUsgList: any[] = [];
    this.selectedScreens.map(usg => {
      const data = {
        userSecurityGroupId: 0,
        securityGroupId: usg.securityGroupId,
        userRoleId: this.userRoleId != null ? this.userRoleId:0,
        userId: this.userId != null? this.userId:0,
      }
      selectedUsgList.push(data);
    })
    this.sgService.deleteUserSecurityGroup(selectedUsgList).subscribe((res: any) => {
      this.messageService.clear();
      if (res.code === 200) {
        this.messageService.add({ key: 'unUsgGrid', severity: 'success', summary: 'Record(s) Unassigned successfully', detail: 'Record(s) Unassigned successfully' });
        this.refreshPanel();
      }
    })

  }

  refreshPanel() {
    this.unAssignSgPanels.emit(true)
  }

  confirmDialog() {
    this.confirmationService.confirm({
      message: UtilConstant.UnAssign_Security_Group_Warning,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onUnAssign();
      },
      key: "positionDialog"
    });
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SgServices } from 'src/app/ui/security-group/services/securityGroup.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-assign-security-group',
  templateUrl: './assign-security-group.component.html',
  styleUrls: ['./assign-security-group.component.scss'],
  providers: [MessageService]
})
export class AssignSecurityGroupComponent implements OnInit {
  rowCount: number = UtilConstant.ROW_COUNT;
  Sg_data: any[] = [];
  selectedScreens: any[] = [];
  userId: number = 0;
  userRoleId: number = 0;
  @Output() assignSgPanels = new EventEmitter();
  constructor(
    private sgService: SgServices,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {

  }

  loadRecords(data: any) {
    this.Sg_data = [];
    this.selectedScreens = [];
    this.userId = data.userId;
    this.userRoleId = data.userRoleId;
    this.sgService.getUnAssignedSg(data).subscribe((res: any) => {
      this.Sg_data = res;
    })
  }

  onAssign() {
    let selectedUsgList: any[] = [];
    this.selectedScreens.map(usg => {
      const data = {
        userSecurityGroupId: 0,
        securityGroupId: usg.securityGroupId,
        userRoleId: this.userRoleId,
        userId: this.userId,
      }
      selectedUsgList.push(data);
    })
    this.sgService.saveUserSecurityGroup(selectedUsgList).subscribe((res: any) => {
      this.messageService.clear();
      if (res.code === 200) {
        this.messageService.add({ key: 'UsgGrid', severity: 'success', summary: 'Record(s) Assigned successfully', detail: 'Record(s) Assigned successfully' });
        this.refreshPanel();
      }
    })
  }

  refreshPanel() {
    this.assignSgPanels.emit(true)
  }

}

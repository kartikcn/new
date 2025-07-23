//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { RmResourcesService } from '../../service/rm-resources.service';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-resource-unassign-screen',
  templateUrl: './resource-unassign-screen.component.html',
  styleUrls: ['./resource-unassign-screen.component.scss'],
  providers: [MessageService]
})
export class ResourceUnassignScreenComponent implements OnInit {
  AssignedResources: any[] = [];
  selectedScreens: any[] = [];
  loading: boolean = false;
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumUsers: EnumList[] = [];
  roomDetails!: String;
  blId!: number;
  flId!: number;
  rmId!: number;
  resourcesId!: number;
  rowCount: number = UtilConstant.ROW_COUNT;
  @Output() allScreenProcsPanels = new EventEmitter();
  constructor(
    private rmResourceSrv: RmResourcesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

  onUnAssign() {
    this.messageService.clear();
    let dataArray: any[] = [];
    this.selectedScreens.forEach((item: any) => {
      var record = {
        blId: this.blId,
        flId: this.flId,
        rmId: this.rmId,
        resourcesId: item.resourcesId,
        rmResourcesId : item.rmResourcesId
      }
      dataArray.push(record);
    })
    this.rmResourceSrv.deleteUserUnAssignedScreens(dataArray).subscribe((res: any) => {
      if(res.code==200){
        this.allScreenProcsPanels.emit("true");
      }else{
        this.messageService.add({ key: 'rmResource', severity: 'error', summary: 'error', detail:res.text });
      }
    })
  }
  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.UnAssign_Warning,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       this.onUnAssign();
      }
    });
  }
}

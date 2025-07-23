import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { RmResourcesDialogueProvider } from '../../provider/rm-resources.provider';
import { EnumList } from 'src/app/model/enum-list.model';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-resource-assign-screen',
  templateUrl: './resource-assign-screen.component.html',
  styleUrls: ['./resource-assign-screen.component.scss'],
  providers: [MessageService]
})
export class ResourceAssignScreenComponent implements OnInit {
  selectedScreens: any[] = [];
  loading: boolean = false;
  unAssignedResources: any = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumUsers: EnumList[] = [];
  enummTypeData: EnumList[] = [];
  blId!: number;
  flId!: number;
  rmId!: number;
  resourcesId!: number;
  rowCount: number = UtilConstant.ROW_COUNT;
  @Output() allScreenProcsPanels = new EventEmitter();
  constructor(
    private rmResourceProvider: RmResourcesDialogueProvider,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

  onAdd(resource: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      blId: this.blId,
      flId: this.flId,
      rmId: this.rmId,
      resourcesId: resource.resourcesId,
      costPerUnit: resource.costPerUnit,
      title: resource.title,
      quantity:resource.quanity,
      rmResourcesId:0
    };
    this.rmResourceProvider.openDialog(dialogConfig);
    this.rmResourceProvider.onDialogueClosed.subscribe((result: any) => {
      if(result !=null){
        this.messageService.clear();
      this.messageService.add({ key: 'rmResource', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
      setTimeout(() => {
        this.allScreenProcsPanels.emit("true");
      }, 1000);
      }
    });
  }

}

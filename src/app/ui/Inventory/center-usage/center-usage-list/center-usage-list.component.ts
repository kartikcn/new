import { Component, OnInit } from '@angular/core';
import { CenterUsage } from '../model/CenterUsage';
import { UtilConstant } from 'src/common/UtilConstant';
import { InventoryService } from '../../service/inventory.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';

@Component({
  selector: 'app-center-usage-list',
  templateUrl: './center-usage-list.component.html',
  styleUrls: ['./center-usage-list.component.scss'],
  providers: [MessageService],
})
export class CenterUsageListComponent implements OnInit {
  centerUsageList: CenterUsage[] = [];
  budgetTermList: any[] = [];
  blIdList: any[] = [];
  flIdList: any[] = [];
  itemList: any[] = [];
  centerUsageData: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  isOpen: boolean = false;
  constructor(
    private inventorySrv: InventoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private blSrv: BuildingService
  ) {}
  ngOnInit(): void {
    this.loadCenterUsageList();
    this.loadEnumsList();
  }

  loadCenterUsageList() {
    this.inventorySrv.getAllCenterUsage().subscribe((res: any) => {
      this.centerUsageList = res && !res.code ? res : [];
    });
  }
  loadEnumsList() {
    this.inventorySrv.getAllBudegetTerm().subscribe((res: any) => {
      this.budgetTermList = res && !res.code ? res : [];
    });
    this.inventorySrv.getAllItems().subscribe((res: any) => {
      this.itemList = res && !res.code ? res : [];
    });
    this.blSrv.getALLBuilding().subscribe((res: any) => {
      this.blIdList = res && !res.code ? res : [];
    });
    this.blSrv.getALLFloor().subscribe((res: any) => {
      this.flIdList = res && !res.code ? res : [];
    });
  }

  openEditItem(id: number) {
    this.centerUsageData = {
      centerUsageId: id,
      isNew: false,
    };
    this.isOpen = true;
  }

  onAdd() {
    this.centerUsageData = {
      centerUsageId: 0,
      isNew: true,
    };
    this.isOpen = true;
  }
  onDelete(data: CenterUsage) {
    this.userDeleteConfirm(data);
  }
  userDeleteConfirm(data: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(data.centerUsageId);
      },
      key: 'confirmeKey',
    });
  }
  deleteRecord(centerUsageId: any) {
    if (centerUsageId) {
      this.inventorySrv
        .deleteCenterUsage(centerUsageId)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.messageService.add({
              key: 'successKey',
              severity: 'success',
              summary: 'Record deleted successfully',
              detail: res.text,
            });
            this.loadCenterUsageList();
          } else {
            this.messageService.add({
              key: 'successKey',
              severity: 'warn',
              summary: 'Delete failed',
              detail: res.text,
            });
          }
        });
    }
  }
  getNameById(id: any, type: string) {
    let sourceList: any[] = [];
    let name: string = '';
    switch (type) {
      case 'BUDGET':
        sourceList = this.budgetTermList;
        name = sourceList.find((v) => v.budgetTermId === id)?.name || '';
        break;
      case 'BUILDING':
        sourceList = this.blIdList;
        name = sourceList.find((v) => v.blId === id)?.blNameString || '';
        break;
      case 'FLOOR':
        sourceList = this.flIdList;
        name = sourceList.find((v) => v.flId === id)?.flNameString || '';
        break;
      case 'ITEM':
        sourceList = this.itemList;
        name = sourceList.find((v) => v.itemId === id)?.name || '';
        break;
      default:
        break;
    }
    return name;
  }

  loadCenterUsageData(event: any) {
    if (event.code == 200) {
      this.messageService.add({
        key: 'successKey',
        severity: 'success',
        summary: 'success',
        detail: event.text,
      });
      this.loadCenterUsageList();
      this.isOpen = false;
    }
    if (event == 'true') {
      this.loadCenterUsageList();
      this.isOpen = false;
    }
  }
}

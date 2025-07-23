import { Component } from '@angular/core';
import { CenterBudget } from './model/CenterBudget';
import { InventoryService } from '../service/inventory.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BuildingService } from '../../background-loc/services/bl.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-center-budget-list',
  templateUrl: './center-budget-list.component.html',
  styleUrls: ['./center-budget-list.component.scss'],
  providers: [MessageService],
})
export class CenterBudgetListComponent {
  centerBudgetList: CenterBudget[] = [];
  budgetTermList: any[] = [];
  blIdList: any[] = [];
  flIdList: any[] = [];
  itemList: any[] = [];
  centerBudgetData: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  isOpen: boolean = false;
  constructor(
    private inventorySrv: InventoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private blSrv: BuildingService
  ) {}
  ngOnInit(): void {
    this.loadCenterBudgetList();
    this.loadEnumsList();
  }

  loadCenterBudgetList() {
    this.inventorySrv.getAllCenterBudget().subscribe((res: any) => {
      this.centerBudgetList = res && !res.code ? res : [];
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
    this.centerBudgetData = {
      centerBudgetId: id,
      isNew: false,
    };
    this.isOpen = true;
  }

  onAdd() {
    this.centerBudgetData = {
      centerBudgetId: 0,
      isNew: true,
    };
    this.isOpen = true;
  }
  onDelete(data: CenterBudget) {
    this.userDeleteConfirm(data);
  }
  userDeleteConfirm(data: any): void {
    this.confirmationService.confirm({
      message:
        'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(data.centerBudgetId);
      },
      key: 'confirmeKey',
    });
  }
  deleteRecord(centerBudgetId: any) {
    if (centerBudgetId) {
      this.inventorySrv
        .deleteCenterBudget(centerBudgetId)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.messageService.add({
              key: 'successKey',
              severity: 'success',
              summary: 'Record deleted successfully',
              detail: res.text,
            });
            this.loadCenterBudgetList();
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

  loadCenterBudgetData(event: any) {
    if (event.code == 200) {
      this.messageService.add({
        key: 'successKey',
        severity: 'success',
        summary: 'success',
        detail: event.text,
      });
      this.loadCenterBudgetList();
      this.isOpen = false;
    }
    if (event == 'true') {
      this.loadCenterBudgetList();
      this.isOpen = false;
    }
  }
}

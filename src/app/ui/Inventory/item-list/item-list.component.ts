import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../service/inventory.service';
import { Item } from './model/Item';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  providers: [MessageService],
})
export class ItemListComponent implements OnInit {
  itemsList: Item[] = [];
  itemData: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  isOpen: boolean = false;
  constructor(
    private inventorySrv: InventoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loadItemList();
  }

  loadItemList() {
    this.inventorySrv.getAllItems().subscribe((res: any) => {
      this.itemsList = res && !res.code ? res : [];
    });
  }

  openEditItem(id: number) {
    this.itemData = {
      itemId: id,
      isNew: false,
    };
    this.isOpen = true;
  }

  onAdd() {
    this.itemData = {
      itemId: 0,
      isNew: true,
    };
    this.isOpen = true;
  }
  onDelete(data: Item) {
    this.userDeleteConfirm(data);
  }
  userDeleteConfirm(data: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + data.name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(data.itemId);
      },
      key: 'confirmeKey',
    });
  }
  deleteRecord(itemId: any) {
    if (itemId) {
      this.inventorySrv.deleteItem(itemId).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({
            key: 'successKey',
            severity: 'success',
            summary: 'Record deleted successfully',
            detail: res.text,
          });
          this.loadItemList();
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
  loadItemData(event: any) {
    if (event.code == 200) {
      this.messageService.add({
        key: 'successKey',
        severity: 'success',
        summary: 'success',
        detail: event.text,
      });
      this.loadItemList();
      this.isOpen = false;
    }

    if (event == 'true') {
      this.loadItemList();
      this.isOpen = false;
    }
  }
}

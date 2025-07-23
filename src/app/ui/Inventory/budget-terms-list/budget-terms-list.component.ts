import { Component, OnInit } from '@angular/core';
import { BudgetTerm } from './model/BudgetTerm';
import { InventoryService } from '../service/inventory.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-budget-terms-list',
  templateUrl: './budget-terms-list.component.html',
  styleUrls: ['./budget-terms-list.component.scss'],
  providers: [MessageService],
})
export class BudgetTermsListComponent implements OnInit {
  budegetTermList: BudgetTerm[] = [];
  budegetTermData: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  isOpen: boolean = false;
  constructor(
    private inventorySrv: InventoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loadBudegetTermList();
  }

  loadBudegetTermList() {
    this.inventorySrv.getAllBudegetTerm().subscribe((res: any) => {
      if (res && !res.code) {
        this.budegetTermList = res;
      }
    });
  }

  openEditItem(id: number) {
    this.budegetTermData = {
      budgetTermId: id,
      isNew: false,
    };
    this.isOpen = true;
  }

  onAdd() {
    this.budegetTermData = {
      budgetTermId: 0,
      isNew: true,
    };
    this.isOpen = true;
  }
  onDelete(data: BudgetTerm) {
    this.userDeleteConfirm(data);
  }
  userDeleteConfirm(data: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + data.name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(data.budgetTermId);
      },
      key: 'confirmeKey',
    });
  }
  deleteRecord(budgetTermId: any) {
    if (budgetTermId) {
      this.inventorySrv.deleteBudgetTerm(budgetTermId).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({
            key: 'successKey',
            severity: 'success',
            summary: 'Record deleted successfully',
            detail: res.text,
          });
          this.loadBudegetTermList();
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

  loadBudegetTermData(event: any) {
    if (event.code == 200) {
      this.messageService.add({
        key: 'successKey',
        severity: 'success',
        summary: 'success',
        detail: event.text,
      });
      this.loadBudegetTermList();
      this.isOpen = false;
    }
    if (event == 'true') {
      this.loadBudegetTermList();
      this.isOpen = false;
    }
  }
}

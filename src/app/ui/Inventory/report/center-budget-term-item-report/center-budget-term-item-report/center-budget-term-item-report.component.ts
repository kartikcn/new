import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilConstant } from 'src/common/UtilConstant';
import { InventoryService } from '../../../service/inventory.service';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { CenterUsage } from '../../../center-usage/model/CenterUsage';

@Component({
  selector: 'app-center-budget-term-item-report',
  templateUrl: './center-budget-term-item-report.component.html',
  styleUrls: ['./center-budget-term-item-report.component.scss'],
})
export class CenterBudgetTermItemReportComponent {
  @Input() budgetTermData!: any;
  @Output() parentFun = new EventEmitter();
  centerBudgetList: any[] = [];
  blIdList: any[] = [];
  flIdList: any[] = [];
  itemList: any[] = [];
  expenseDataList:CenterUsage[]=[];
  rowCount: number = UtilConstant.ROW_COUNT;
  title:string='';
  showDetails: boolean= false;
  constructor(
    private inventorySrv: InventoryService,
    private blSrv: BuildingService
  ) {}
  ngOnInit(): void {
    const{name, ...selectedBudgetData} = this.budgetTermData;
    this.loadCenterBudgetList(selectedBudgetData);
    this.loadEnumsList();
    this.title += name;
  }

  loadCenterBudgetList(data: any) {
    if (data) {
      this.inventorySrv
        .getCenterBudgetByBlIdFlId(data)
        .subscribe((res: any) => {
          this.centerBudgetList = res && !res.code ? res : [];
        });
    }
  }
  loadEnumsList() {
    const {blId, flId} = this.budgetTermData;
    this.inventorySrv.getAllItems().subscribe((res: any) => {
      this.itemList = res && !res.code ? res : [];
    });
  }
  loadItemExpenseData(data:any) {
    if(data){
      this.inventorySrv.getCenterUsageItemExpense(data).subscribe((res: any) => {
        this.expenseDataList = res && !res.code ? res : [];
      });
    }
  }
  getNameById(id: any, type: string) {
    let sourceList: any[] = [];
    let name: string = '';
    switch (type) {
      case 'ITEM':
        sourceList = this.itemList;
        name = sourceList.find((v) => v.itemId === id)?.name || '';
        break;
      default:
        break;
    }
    return name;
  }

  clickBack() {
    this.parentFun.emit({ ...this.budgetTermData, close: true });
  }
  getColor(data:any) {
    const {budget, expense} = data;
    if(budget && expense){
      return  budget > expense ? "#495057" : '#F75D59';
    }
    return '#495057';
  }
  showExpenses(e:any, data:any) {
    e.stopPropagation();
    this.loadItemExpenseData(data);
    this.showDetails = true;
  }
  onCancel() {
    this.expenseDataList = [];
    this.showDetails = false;
    this.title = 'Inventory Report'
  }
}

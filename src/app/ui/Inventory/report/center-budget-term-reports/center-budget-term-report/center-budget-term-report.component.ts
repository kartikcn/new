import { Component, OnInit } from '@angular/core';
import { BudgetTermReportInputs } from '../../model/BudgetTermReportInputs';
import { UtilConstant } from 'src/common/UtilConstant';
import { InventoryService } from '../../../service/inventory.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { CenterUsage } from '../../../center-usage/model/CenterUsage';

@Component({
  selector: 'app-center-budget-term-report',
  templateUrl: './center-budget-term-report.component.html',
  styleUrls: ['./center-budget-term-report.component.scss'],
})
export class CenterBudgetTermReportComponent implements OnInit {
  budgetTermForm!: UntypedFormGroup;
  CenterbudgetList: BudgetTermReportInputs[] = [];
  budgetTermList: any[] = [];
  expenseDataList: CenterUsage[] = [];
  selectedBudgetTerm!: any;
  isBudgetTermSelectd: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  isNew: boolean = true;
  budgetTermData: any = { budgetTermId: 0 };
  blIdList: any[] = [];
  flIdList: any[] = [];
  itemList: any[] = [];
  title: string = 'Inventory Report';
  showDetails: boolean = false;
  constructor(
    private service: InventoryService,
    private fb: FormBuilder,
    private blSrv: BuildingService
  ) {
    this.budgetTermForm = fb.group({
      budgetTermId: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadEnumsList();
    this.loadCenterBudgetList(this.budgetTermData);
  }
  loadEnumsList() {
    this.service.getAllBudegetTerm().subscribe((res: any) => {
      this.budgetTermList = res && !res.code ? res : [];
    });
    this.service.getAllItems().subscribe((res: any) => {
      this.itemList = res && !res.code ? res : [];
    });
    this.blSrv.getALLBuilding().subscribe((res: any) => {
      this.blIdList = res && !res.code ? res : [];
    });
    this.blSrv.getALLFloor().subscribe((res: any) => {
      this.flIdList = res && !res.code ? res : [];
    });
  }

  loadCenterBudgetList(data: any) {
    const { budgetTermId, close } = data;
    if (close) {
      this.isBudgetTermSelectd = false;
      this.title = 'Inventory Report';
      this.title +=
        ' | ' + this.getNameById(budgetTermId, 'BUDGET');
    }
    if (budgetTermId && budgetTermId != 0) {
      this.service
        .getCenterBudgetByBudgetTermId(budgetTermId)
        .subscribe((res: any) => {
          this.CenterbudgetList = res && !res.code ? res : [];
        });
    }
  }

  loadExpenseData(data: any) {
    if (data) {
      this.service.getCenterUsageExpense(data).subscribe((res: any) => {
        this.expenseDataList = res && !res.code ? res : [];
      });
    }
  }
  onRowSelect(event: any) {
    console.log(event.data);
    this.isBudgetTermSelectd = true;
    this.selectedBudgetTerm = event.data;
    this.title = 'Inventory Report';
    this.title +=
      ' | ' + this.getNameById(this.selectedBudgetTerm.budgetTermId, 'BUDGET');
    this.title +=
      ' | ' + this.getNameById(this.selectedBudgetTerm.blId, 'BUILDING');
    this.title +=
      ' | ' + this.getNameById(this.selectedBudgetTerm.flId, 'FLOOR');
    this.selectedBudgetTerm = { ...this.selectedBudgetTerm, name: this.title };
  }
  onSelectBudgetTerm(event: any) {
    const { budgetTermId, name } = event;
    this.budgetTermForm.patchValue({
      budgetTermId: budgetTermId,
    });
  }
  onSearch() {
    const filterData = this.getBudgetTerm();
    this.title = 'Inventory Report';
    this.title +=
      ' | ' + this.getNameById(filterData.budgetTermId, 'BUDGET');
    this.loadCenterBudgetList(filterData);
  }
  getBudgetTerm() {
    this.budgetTermData = {
      budgetTermId: this.budgetTermForm.controls.budgetTermId.value,
    };
    return this.budgetTermData;
  }
  onClickClear() {
    this.budgetTermForm.patchValue({
      budgetTermId: null,
    });
    this.isBudgetTermSelectd = false;
    this.selectedBudgetTerm = new BudgetTermReportInputs();
    this.title = 'Inventory Report';
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
  getColor(data: any) {
    const { budget, expense } = data;
    if (budget && expense) {
      return budget > expense ? '#495057' : '#F75D59';
    }
    return '#495057';
  }
  showExpenses(e: any, data: any) {
    e.stopPropagation();
    this.loadExpenseData(data);
    this.showDetails = true;
  }
  onCancel() {
    this.showDetails = false;
  }
}

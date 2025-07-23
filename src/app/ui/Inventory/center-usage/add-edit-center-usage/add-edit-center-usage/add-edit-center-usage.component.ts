import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { InventoryService } from '../../../service/inventory.service';
import { MessageService } from 'primeng/api';
import { CenterUsage } from '../../model/CenterUsage';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';

@Component({
  selector: 'app-add-edit-center-usage',
  templateUrl: './add-edit-center-usage.component.html',
  styleUrls: ['./add-edit-center-usage.component.scss'],
  providers: [MessageService],
})
export class AddEditCenterUsageComponent
  implements ControlValueAccessor, OnDestroy
{
  @Input() centerUsageData: any;
  @Output() parentFun = new EventEmitter();
  showDialogue: boolean = true;
  formCenterUsage!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  centerBudgetList: any[] = [];
  title: string = 'Add';
  isNew: boolean = false;
  currentDate: string | null = '';
  userId: number = 0;
  budgetTermList: any[] = [];
  blIdList: any[] = [];
  flIdList: any[] = [];
  itemList: any[] = [];
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  filterCriteria: any = {
    fieldName: null,
    value: null,
    matchMode: 'contains',
    limit: 0,
    offset: 0,
  };
  selectedBl: any = {};
  selectedFl: any = {};
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  errMsg!: string | null;
  totalCostAndBudget: any = null;
  oldCost: any = null;
  flag: boolean = false;
  isSubmit: boolean = false;
  selectedIds: any;
  constructor(
    private fb: FormBuilder,
    private inventorySrv: InventoryService,
    private datePipe: DatePipe,
    private auth: AuthService,
    private messageService: MessageService,
    private blServ: BuildingService
  ) {
    this.formCenterUsage = fb.group({
      centerUsageId: [0],
      budgetTermId: [null, Validators.required],
      blId: [null, Validators.required],
      flId: [null, Validators.required],
      itemId: [null, Validators.required],
      quantity: [0, Validators.required],
      cost: [0, Validators.required],
      rate: [0, Validators.required],
      overUsageReason: [null],
      enteredBy: [null],
      enteredDate: [null],
    });
    this.subscriptions.push(
      this.formCenterUsage.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.isNew = this.centerUsageData.isNew;
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
    this.userId = this.auth.getLoggedInUserId();
    this.formCenterUsage.patchValue({
      enteredBy: this.userId,
      enteredDate: this.currentDate,
    });
    this.loadCenterUsageById(this.centerUsageData.centerUsageId);
    this.loadEnumList();
    if (!this.isNew) this.title = 'Edit';
  }

  loadCenterUsageById(id: number) {
    if (id != 0) {
      this.inventorySrv.getCenterUsageById(id).subscribe((res: any) => {
        if (res && !res.code) {
          this.formCenterUsage.patchValue({
            centerUsageId: res.centerUsageId,
            budgetTermId: res.budgetTermId,
            blId: res.blId,
            flId: res.flId,
            itemId: res.itemId,
            quantity: res.quantity,
            cost: res.cost,
            rate: res.rate,
            overUsageReason: res.overUsageReason,
            enteredBy: res.enteredBy,
            enteredDate: res.enteredDate,
          });
          this.oldCost = res.cost;
          this.selectedIds = this.getSelectedIds();
          this.scrollToEndBl();
          this.scrollToEndFl();
          this.fetchTotalCostAndBudget();
        }
      });
    }
  }
  loadEnumList() {
    this.inventorySrv.getAllBudegetTerm().subscribe((res: any) => {
      this.budgetTermList = res && !res.code ? res : [];
    });
    this.inventorySrv.getAllItems().subscribe((res: any) => {
      this.itemList = res && !res.code ? res : [];
    });
  }
  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.formCenterUsage.patchValue({
        flId: null,
      });
    }, 10);
    if ($event.blId != null) {
      this.selectedBl = $event;
      this.selectedFl = {};
    } else {
      this.selectedBl = {};
      this.selectedFl = {};
    }
  }
  onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    this.filterCriteria = {
      fieldName: null,
      value: null,
      matchMode: 'contains',
      limit: 0,
      offset: 0,
    };
    this.scrollToEndBl();
  }
  updateBlList(blData: any) {
    if (blData.blId) {
      this.blIdList = this.blIdList.filter((t) => t.blId !== blData.blId);
      this.blIdList = this.blIdList.filter((t) => t.blId !== null);
      this.blIdList.unshift(blData);
    }
    this.blIdList.unshift({
      blId: null,
      blNameString: 'Make a selection',
      siteId: null,
    });
  }
  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blServ
      .getALLBuildingByScroll(this.filterCriteria)
      .subscribe((res: any) => {
        this.blIdList = res;
        this.updateBlList(this.selectedBl);
      });
  }
  searchBl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = {
      fieldName: 'blName',
      value: event.term,
      matchMode: 'contains',
    };
    this.scrollToEndBl();
  }
  searchFl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = {
      fieldName: 'flName',
      value: event.term,
      matchMode: 'contains',
    };
    this.scrollToEndFl();
  }
  onSelectFlCode(event: any) {
    if (event.flId != null) {
      const blData: any = {
        blId: event.blId,
        blNameString: event.blNameString,
        site: null,
      };
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.formCenterUsage.patchValue({
          blId: event.blId,
        });
      }, 10);
    } else {
    }
  }
  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blServ
      .getALLFloorByScroll(this.filterCriteria)
      .subscribe((res: any) => {
        this.flIdList = res;
        this.updateFlList(this.selectedFl);
      });
  }

  updateFlList(flData: any) {
    if (flData.flId) {
      this.flIdList = this.flIdList.filter((t) => t.flId !== flData.flId);
      this.flIdList = this.flIdList.filter((t) => t.flId !== null);
      this.flIdList.unshift(flData);
    }
    this.flIdList.unshift({
      flId: null,
      flNameString: 'Make a selection',
      blId: null,
    });
  }

  onOpenFl() {
    this.limitFl = 0;
    this.offsetFl = 0;
    if (this.selectedBl.blId) {
      this.filterCriteria = {
        fieldName: 'bl.blId',
        value: this.selectedBl.blId,
        matchMode: 'equals',
        limit: 0,
        offset: 0,
      };
    } else {
      this.filterCriteria = {
        fieldName: null,
        value: null,
        matchMode: 'contains',
        limit: 0,
        offset: 0,
      };
    }
    this.scrollToEndFl();
  }
  get value(): CenterUsage {
    const item: CenterUsage = {
      centerUsageId: this.formCenterUsage.controls.centerUsageId.value,
      budgetTermId: this.formCenterUsage.controls.budgetTermId.value,
      blId: this.formCenterUsage.controls.blId.value,
      flId: this.formCenterUsage.controls.flId.value,
      itemId: this.formCenterUsage.controls.itemId.value,
      quantity: this.formCenterUsage.controls.quantity.value,
      cost: this.formCenterUsage.controls.cost.value,
      rate: this.formCenterUsage.controls.rate.value,
      overUsageReason: this.formCenterUsage.controls.overUsageReason.value,
      enteredBy: this.formCenterUsage.controls.enteredBy.value,
      enteredDate: this.formCenterUsage.controls.enteredDate.value,
    };
    return item;
  }

  set value(value: CenterUsage) {
    setTimeout(() => {
      this.formCenterUsage.patchValue({
        centerUsageId: value.centerUsageId,
        budgetTermId: value.budgetTermId,
        blId: value.blId,
        flId: value.flId,
        itemId: value.itemId,
        quantity: value.quantity,
        cost: value.cost,
        rate: value.rate,
        overUsageReason: value.overUsageReason,
        enteredBy: value.enteredBy,
        enteredDate: value.enteredDate,
      });
      this.onChange(value);
      this.onTouched();
    }, 0);
  }
  getSelectedIds(): any {
    return {
      centerUsageId: this.formCenterUsage.controls.centerUsageId.value,
      budgetTermId: this.formCenterUsage.controls.budgetTermId.value || null,
      blId: this.formCenterUsage.controls.blId.value || null,
      flId: this.formCenterUsage.controls.flId.value || null,
      itemId: this.formCenterUsage.controls.itemId.value || null,
    };
  }
  calculateUsageAndCost() {
    const quantity = this.formCenterUsage.controls.quantity.value;
    const costPerUnit = this.formCenterUsage.controls.rate.value;
    const cost = quantity * costPerUnit;
    this.formCenterUsage.patchValue({ cost }, { emitEvent: false });

    const newSelectedIds = this.getSelectedIds();

    if (JSON.stringify(newSelectedIds) !== JSON.stringify(this.selectedIds)) {
      this.selectedIds = newSelectedIds;
      this.fetchTotalCostAndBudget();
      return;
    }

    if (this.totalCostAndBudget) {
      this.checkBudgetIsExceed(this.totalCostAndBudget);
    } else {
      this.fetchTotalCostAndBudget();
    }
  }
  isEqual(obj1: any, obj2: any) {}
  checkBudgetIsExceed(totalCostAndBudget: any) {
    const {cost, budget} = totalCostAndBudget;

    if (!budget) {
      if (this.isSubmit) {
        this.saveRecords();
        this.isSubmit = false;
      }
      this.clearErrors();
      return;
    }

    const newCost = !this.isNew ? this.formCenterUsage.controls.cost.value === this.oldCost ? 0
    :this.formCenterUsage.controls.cost.value:this.formCenterUsage.controls.cost.value;

    const totalCost = this.oldCost
      ? cost - this.oldCost + newCost
      : cost + newCost;
    const exceededBy = totalCost > budget ? totalCost - budget : null;
    if (exceededBy) {
      this.setExceedBudgetErrors(exceededBy);
    } else {
      this.clearErrors();
    }

    if (this.isSubmit) {
      this.saveRecords();
      this.isSubmit = false;
    }
  }

  validateInput(data: any): boolean {
    return (
      !!data &&
      !!data.budgetTermId &&
      !!data.blId &&
      !!data.flId &&
      !!data.itemId
    );
  }

  onSave() {
    this.fetchTotalCostAndBudget();
    this.isSubmit = true;
  }

  fetchTotalCostAndBudget(): void {
    if (this.validateInput(this.selectedIds)) {
      this.inventorySrv.checkUsage(this.selectedIds).subscribe((res: any) => {
        this.totalCostAndBudget = res.data;
        this.checkBudgetIsExceed(this.totalCostAndBudget);
      });
    }
  }

  saveRecords() {
    this.messageService.clear();
    if (this.formCenterUsage.valid) {
      const centerUsage = this.getCenterUsage();
      this.inventorySrv.saveCenterUsage(centerUsage).subscribe((res: any) => {
        if (res.code == 200) {
          this.isSubmit = false;
          this.parentFun.emit(res);
          this.formCenterUsage.reset();
        } else {
          this.messageService.add({
            key: 'save',
            severity: 'error',
            summary: 'error',
            detail: res.text,
          });
        }
      });
    }
  }

  setExceedBudgetErrors(exceededBy: number): void {
    this.errMsg = `Usage cost has exceeded the budget by ${exceededBy}. Please provide a reason for over usage.`;
    this.formCenterUsage.controls.overUsageReason.setErrors({
      usageExceed: true,
    });

    if (this.formCenterUsage.controls.overUsageReason?.value) {
      this.formCenterUsage.controls.overUsageReason.setErrors(null);
    }
  }

  clearErrors(): void {
    this.errMsg = null;
    this.formCenterUsage.controls.overUsageReason.setErrors(null);
  }

  getCenterUsage() {
    let centerUsage: any = {
      budgetTermId: this.formCenterUsage.controls.budgetTermId.value,
      blId: this.formCenterUsage.controls.blId.value,
      flId: this.formCenterUsage.controls.flId.value,
      itemId: this.formCenterUsage.controls.itemId.value,
      quantity: this.formCenterUsage.controls.quantity.value,
      cost: this.formCenterUsage.controls.cost.value,
      rate: this.formCenterUsage.controls.rate.value,
      overUsageReason: this.formCenterUsage.controls.overUsageReason.value,
      enteredBy: this.formCenterUsage.controls.enteredBy.value,
      enteredDate: this.formCenterUsage.controls.enteredDate.value,
    };
    if (!this.isNew) {
      centerUsage.centerUsageId =
        this.formCenterUsage.controls.centerUsageId.value;
    }
    return centerUsage;
  }

  onCancel() {
    this.parentFun.emit('true');
    this.formCenterUsage.reset();
    this.isSubmit = false;
  }
  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.formCenterUsage.reset();
    }
  }

  onChange: any = () => {
    this.calculateUsageAndCost();
  };
  onTouched: any = () => {};

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}

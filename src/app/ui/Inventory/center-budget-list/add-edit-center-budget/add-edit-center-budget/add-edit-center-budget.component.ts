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
import { CenterBudget } from '../../model/CenterBudget';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';

@Component({
  selector: 'app-add-edit-center-budget',
  templateUrl: './add-edit-center-budget.component.html',
  styleUrls: ['./add-edit-center-budget.component.scss'],
})
export class AddEditCenterBudgetComponent
  implements ControlValueAccessor, OnDestroy
{
  @Input() centerBudgetData: any;
  @Output() parentFun = new EventEmitter();
  showDialogue: boolean = true;
  formCenterBudget!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  budgetTermList: any[] = [];
  blIdList: any[] = [];
  flIdList: any[] = [];
  itemList: any[] = [];
  title: string = 'Add';
  isNew: boolean = false;
  currentDate: string | null = '';
  userId: number = 0;
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
  constructor(
    private fb: FormBuilder,
    private inventorySrv: InventoryService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private auth: AuthService,
    private blServ: BuildingService
  ) {
    this.formCenterBudget = fb.group({
      centerBudgetId: [0],
      budgetTermId: [null, Validators.required],
      blId: [null, Validators.required],
      flId: [null, Validators.required],
      itemId: [null, Validators.required],
      budget: [0, Validators.required],
      enteredBy: [null],
      enteredDate: [null],
    });
    this.subscriptions.push(
      this.formCenterBudget.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
    this.userId = this.auth.getLoggedInUserId();
    this.formCenterBudget.patchValue({
      enteredBy: this.userId,
      enteredDate: this.currentDate,
    });
    this.isNew = this.centerBudgetData.isNew;
    this.loadCenterBudgetId(this.centerBudgetData.centerBudgetId);
    this.loadEnumList();
    if (!this.isNew) this.title = 'Edit';
  }

  loadCenterBudgetId(id: number) {
    if (id != 0) {
      this.inventorySrv.getCenterBudgetById(id).subscribe((res: any) => {
        if (res && !res.code) {
          this.formCenterBudget.patchValue({
            centerBudgetId: res.centerBudgetId,
            budgetTermId: res.budgetTermId,
            blId: res.blId,
            flId: res.flId,
            itemId: res.itemId,
            budget: res.budget,
            enteredBy: res.enteredBy,
            enteredDate: res.enteredDate,
          });
          this.scrollToEndBl();
          this.scrollToEndFl();
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
      this.formCenterBudget.patchValue({
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
        this.formCenterBudget.patchValue({
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

  get value(): CenterBudget {
    const centerBudgetDt: CenterBudget = {
      centerBudgetId: this.formCenterBudget.controls.centerBudgetId.value,
      budgetTermId: this.formCenterBudget.controls.budgetTermId.value,
      blId: this.formCenterBudget.controls.blId.value,
      flId: this.formCenterBudget.controls.flId.value,
      itemId: this.formCenterBudget.controls.itemId.value,
      budget: this.formCenterBudget.controls.budget.value,
      enteredBy: this.formCenterBudget.controls.enteredBy.value,
      enteredDate: this.formCenterBudget.controls.enteredDate.value,
    };
    return centerBudgetDt;
  }

  set value(value: CenterBudget) {
    setTimeout(() => {
      this.formCenterBudget.patchValue({
        centerBudgetId: value.centerBudgetId,
        budgetTermId: value.budgetTermId,
        blId: value.blId,
        flId: value.flId,
        itemId: value.itemId,
        budget: value.budget,
        enteredBy: value.enteredBy,
        enteredDate: value.enteredDate,
      });
      this.onChange(value);
      this.onTouched();
    }, 0);
  }

  saveRecords() {
    this.messageService.clear();
    if (this.formCenterBudget.valid) {
      let centerBudgetDt: any = {
        budgetTermId: this.formCenterBudget.controls.budgetTermId.value,
        blId: this.formCenterBudget.controls.blId.value,
        flId: this.formCenterBudget.controls.flId.value,
        itemId: this.formCenterBudget.controls.itemId.value,
        budget: this.formCenterBudget.controls.budget.value,
        enteredBy: this.formCenterBudget.controls.enteredBy.value,
        enteredDate: this.formCenterBudget.controls.enteredDate.value,
      };

      if (!this.isNew) {
        centerBudgetDt.centerBudgetId =
          this.formCenterBudget.controls.centerBudgetId.value;
      }

      this.inventorySrv
        .saveCenterBudget(centerBudgetDt)
        .subscribe((res: any) => {
          if (res.code == 200) {
            this.parentFun.emit(res);
            this.formCenterBudget.reset();
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

  onCancel() {
    this.parentFun.emit('true');
    this.formCenterBudget.reset();
  }
  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.formCenterBudget.reset();
    }
  }

  onChange: any = () => {};
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

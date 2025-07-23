import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { InventoryService } from '../../../service/inventory.service';
import { MessageService } from 'primeng/api';
import { BudgetTerm } from '../../model/BudgetTerm';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-budget-terms',
  templateUrl: './add-edit-budget-terms.component.html',
  styleUrls: ['./add-edit-budget-terms.component.scss'],
})
export class AddEditBudgetTermsComponent
  implements ControlValueAccessor, OnDestroy
{
  @Input() budegetTermData: any;
  @Output() parentFun = new EventEmitter();
  showDialogue: boolean = true;
  formBudgetTerms!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  title: string = 'Add';
  isNew: boolean = false;
  errorMsg: string = '';
  constructor(
    private fb: FormBuilder,
    private inventorySrv: InventoryService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    this.formBudgetTerms = fb.group({
      budgetTermId: [0],
      name: [null, Validators.required],
      dateFrom: [null, [this.checkDateValidation(), Validators.required]],
      dateTo: [null, [this.checkDateValidation(), Validators.required]],
    });
    this.subscriptions.push(
      this.formBudgetTerms.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.isNew = this.budegetTermData.isNew;
    this.loadBudegetTermById(this.budegetTermData.budgetTermId);
    if (!this.isNew) this.title = 'Edit';
  }

  loadBudegetTermById(id: number) {
    if (id != 0) {
      this.inventorySrv.getBudegetTermById(id).subscribe((res: any) => {
        if (res && !res.code) {
          this.formBudgetTerms.patchValue({
            budgetTermId: res.budgetTermId,
            name: res.name,
            dateFrom: this.datePipe.transform(res.dateFrom, 'dd MMM yyyy'),
            dateTo: this.datePipe.transform(res.dateTo, 'dd MMM yyyy'),
          });
        }
      });
    }
  }

  get value(): BudgetTerm {
    const budgetTerm: BudgetTerm = {
      budgetTermId: this.formBudgetTerms.controls.budgetTermId.value,
      name: this.formBudgetTerms.controls.name.value,
      dateFrom: this.formBudgetTerms.controls.dateFrom.value,
      dateTo: this.formBudgetTerms.controls.dateTo.value,
    };
    return budgetTerm;
  }

  set value(value: BudgetTerm) {
    setTimeout(() => {
      this.formBudgetTerms.patchValue({
        budgetTermId: value.budgetTermId,
        name: value.name,
        dateFrom: value.dateFrom,
        dateTo: value.dateTo,
      });
      this.onChange(value);
      this.onTouched();
    }, 0);
  }

  saveRecords() {
    this.messageService.clear();
    if (this.formBudgetTerms.valid) {
      let budgetTerm: any;

      const formattedDateFrom = this.datePipe.transform(
        this.formBudgetTerms.controls.dateFrom.value,
        'yyyy-MM-dd'
      );
      const formattedDateTo = this.datePipe.transform(
        this.formBudgetTerms.controls.dateTo.value,
        'yyyy-MM-dd'
      );

      budgetTerm = {
        name: this.formBudgetTerms.controls.name.value,
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo,
      };

      if (!this.isNew) {
        budgetTerm.budgetTermId =
          this.formBudgetTerms.controls.budgetTermId.value;
      }

      this.inventorySrv.saveBudgetTerm(budgetTerm).subscribe((res: any) => {
        if (res.code == 200) {
          this.parentFun.emit(res);
          this.formBudgetTerms.reset();
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
    this.formBudgetTerms.reset();
  }

  checkDateValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null) {
        this.formBudgetTerms.controls['dateFrom'].setErrors(null);
        this.formBudgetTerms.controls['dateTo'].setErrors(null);
        this.formBudgetTerms.clearAsyncValidators();
        this.formBudgetTerms.updateValueAndValidity();
        var fromDate = new Date(
          this.formBudgetTerms.controls['dateFrom'].value
        );
        var toDate = new Date(this.formBudgetTerms.controls['dateTo'].value);

        if (
          toDate.getFullYear() != 1970 &&
          fromDate.getTime() > toDate.getTime()
        ) {
          this.formBudgetTerms.controls['dateTo'].setErrors({
            incorrect: true,
          });
          this.formBudgetTerms.updateValueAndValidity();
          this.errorMsg = 'Date To  should be greater than Date From.';
          return { incorrect: true };
        } else {
          return null;
        }
      }
      return null;
    };
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.formBudgetTerms.reset();
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

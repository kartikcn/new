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
import { InventoryService } from '../../../service/inventory.service';
import { Subscription } from 'rxjs';
import { Item } from '../../model/Item';
import { EnumService } from 'src/app/services/enum.service';
import { EnumList } from 'src/app/model/enum-list.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-item',
  templateUrl: './add-edit-item.component.html',
  styleUrls: ['./add-edit-item.component.scss'],
  providers: [MessageService],
})
export class AddEditItemComponent implements ControlValueAccessor, OnDestroy {
  @Input() itemData: any;
  @Output() parentFun = new EventEmitter();
  showDialogue: boolean = true;
  formItem!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  unitEnums: EnumList[] = [];
  title: string = 'Add';
  isNew: boolean = false;
  constructor(
    private fb: FormBuilder,
    private inventorySrv: InventoryService,
    private enumSrv: EnumService,
    private messageService: MessageService
  ) {
    this.formItem = fb.group({
      itemId: [0],
      name: [null, Validators.required],
      stock: [0, Validators.required],
      unit: ['Nos', Validators.required],
      minStockReq: [0, Validators.required],
      rate: [0, Validators.required],
    });
    this.subscriptions.push(
      this.formItem.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.isNew = this.itemData.isNew;
    this.loadItemById(this.itemData.itemId);
    this.loadEnums();
    if (!this.isNew) this.title = 'Edit';
  }

  loadItemById(id: number) {
    if (id != 0) {
      this.inventorySrv.getItemByItemId(id).subscribe((res: any) => {
        if (res && !res.code) {
          this.formItem.patchValue({
            itemId: res.itemId,
            name: res.name,
            minStockReq: res.minStockReq,
            rate: res.rate,
            stock: res.stock,
            unit: res.unit,
          });
        }
      });
    }
  }
  loadEnums() {
    this.enumSrv.getEnums().subscribe((res: EnumList[]) => {
      if (res) {
        this.unitEnums = res.filter(
          (t: any) =>
            t.tableName.toLocaleUpperCase() === 'item'.toLocaleUpperCase() &&
            t.fieldName.toLocaleUpperCase() === 'unit'.toLocaleUpperCase()
        );
      }
    });
  }
  get value(): Item {
    const item: Item = {
      itemId: this.formItem.controls.itemId.value,
      name: this.formItem.controls.name.value,
      minStockReq: this.formItem.controls.minStockReq.value,
      rate: this.formItem.controls.rate.value,
      stock: this.formItem.controls.stock.value,
      unit: this.formItem.controls.unit.value,
    };
    return item;
  }

  set value(value: Item) {
    setTimeout(() => {
      this.formItem.patchValue({
        itemId: value.itemId,
        name: value.name,
        minStockReq: value.minStockReq,
        rate: value.rate,
        stock: value.stock,
        unit: value.unit,
      });
      this.onChange(value);
      this.onTouched();
    }, 0);
  }

  saveRecords() {
    this.messageService.clear();
    if (this.formItem.valid) {
      let item: any = {
        name: this.formItem.controls.name.value,
        minStockReq: this.formItem.controls.minStockReq.value,
        rate: this.formItem.controls.rate.value,
        stock: this.formItem.controls.stock.value,
        unit: this.formItem.controls.unit.value,
      };
      if (!this.isNew) {
        item.itemId = this.formItem.controls.itemId.value;
      }
      this.inventorySrv.saveItem(item).subscribe((res: any) => {
        if (res.code == 200) {
          this.parentFun.emit(res);
          this.formItem.reset();
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
    this.formItem.reset();
  }
  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.formItem.reset();
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

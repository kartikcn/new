import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { PartsService } from 'src/app/ui/Helpdesk/parts/services/parts.service';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { RequestPartsService } from '../../services/request-parts.service';

@Component({
  selector: 'app-add-request-parts',
  templateUrl: './add-request-parts.component.html',
  styleUrls: ['./add-request-parts.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRequestPartsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRequestPartsComponent),
      multi: true
    }
  ]
})
export class AddRequestPartsComponent implements OnInit {
  requestPartsForm: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  partsData: any[] = [];
  errorMsg: String = '';
  previousPartQnty: any = 0;
  partExist: boolean = false;
  previousPart: String = '';
  showDetails:boolean = false;
  enumConsumable:any[]=[];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumPartsData: Enums[] = [];
  enumMeasurment:any[]=[];
  enableDetailsBtn:boolean = false;
  isRequestor:boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  requestId:any
  requiredQtyError:boolean = false;
  actualQtyError:boolean = false;
  selectedPart: any;
  @Input() isNew: boolean = false;
  @Input() isView: boolean = false;
  constructor(
    private partService: PartsService,
    private formBuilder: UntypedFormBuilder,
    private requestPartsSrv: RequestPartsService,
    private enumsrv: EnumService,
  ) {
    this.requestPartsForm = this.formBuilder.group({
      partId: [null, [Validators.required]],
      AvalQuantity: [null,],
      reqQuantity: [null, [Validators.required, Validators.min(1)]],
      requestPartId: [null,],
      requestId: [null,],
      dateAssigned: [null],
      timeAssigned: [null],
      actualQuantityUsed: [null],
      unitOfMeasurement: [null],
      addedBy:[null]

    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.requestPartsForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );

  }

  ngOnInit(): void {
    this.loadParts();
    this.loadEnums();
    if(this.isView) {
      this.requestPartsForm.disable();
    }
  }

  loadParts() {
    this.partService.getAllParts().subscribe((res: any) => {
      if (res) {
        this.partsData = res;
      } else {
        this.partsData = [];
      }
    })
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumPartsData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase());
        this.enumConsumable = this.enumPartsData.filter(t => t.fieldName.toLocaleUpperCase() === 'consumable'.toLocaleUpperCase());
        this.enumMeasurment = this.enumPartsData.filter(t => t.fieldName.toLocaleUpperCase() === 'unit_of_measurement'.toLocaleUpperCase());
        },
     error => {
     }
    );
  }

  selectPartCode(event: any) {
    this.enableDetailsBtn = true;
   
    if (this.previousPart != event.partId) {
      let requestId = this.requestId;
      this.requestPartsSrv.checkPartExist(requestId, event.partId).subscribe((res: any) => {
        this.partExist = false;
        if (res) {
          this.partExist = true;
        } else {
          this.partExist = false;
        }
      })
    }
    setTimeout(() => {
      this.requestPartsForm.patchValue({
        AvalQuantity: event.qutOnHand,
        unitOfMeasurement: event.unitOfMeasurement,
        reqQuantity: null
      });
    });

  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];

    return validationErros;
  }
  /// End Of Form Validation Related Code
  get value(): any {
    const toolsDetails: any = {
      partId: this.requestPartsForm.controls.partId.value,
      AvalQuantity: this.requestPartsForm.controls.AvalQuantity.value,
      reqQuantity: this.requestPartsForm.controls.reqQuantity.value,
      requestPartId: this.requestPartsForm.controls.requestPartId.value,
      requestId: this.requestPartsForm.controls.requestId.value,
      dateAssigned: this.requestPartsForm.controls.dateAssigned.value,
      timeAssigned: this.requestPartsForm.controls.timeAssigned.value,
      actualQuantityUsed: this.requestPartsForm.controls.actualQuantityUsed.value != null ? this.requestPartsForm.controls.actualQuantityUsed.value : 0,
      addedBy: this.requestPartsForm.controls.addedBy.value
    };
    return toolsDetails;
  }

  set value(value: any) {
   
    setTimeout(() => {
      this.requestPartsForm.patchValue({
        partId: value.partId,
        AvalQuantity: value.reqQuantity ? this.getAvalQuantity(value.partId) + parseInt(value.reqQuantity) : null,
        reqQuantity: value.reqQuantity,
        requestPartId: value.requestPartId,
        requestId: value.requestId,
        dateAssigned: value.dateAssigned,
        timeAssigned: value.timeAssigned,
        actualQuantityUsed: value.actualQuantityUsed != null? value.actualQuantityUsed : 0,
        unitOfMeasurement: value.partUnitOfMeasurement,
        addedBy: value.addedBy
      });
      if(value.partId) {
        this.enableDetailsBtn = true;
        this.getSelectedPart(value.partId);
      
      }
    });
    this.onChange(value);
    this.onTouched();
  }

  getAvalQuantity(partId: any) {
    let selectedPart = this.partsData.find((t: any) => t.partId === partId);
    if (selectedPart) {
      return selectedPart.qutOnHand
    }
  }

  getSelectedPart(partId:any) {
     this.selectedPart = this.partsData.find((t: any) => t.partId === partId);
    if (this.selectedPart) {
      return this.selectedPart;
    }
  }

  changeReqQuantity(event: any,inputField:any) {
    let userInput = event.target.value;
    this.errorMsg = '';
    let actlQty = this.requestPartsForm.controls.AvalQuantity.value;
    if (actlQty - userInput < 0) {
      this.errorMsg = `${inputField} can not be greater than Available Quantity.`;
      inputField === 'Required Quantity' ? this.requiredQtyError = true : this.actualQtyError = true;
    } else if (userInput != '' && userInput <= 0) {
      this.errorMsg = `${inputField} can not be less than one`;
      inputField === 'Required Quantity' ? this.requiredQtyError = true : this.actualQtyError = true;
    } else {
      this.errorMsg = '';
      this.requiredQtyError = false;
      this.actualQtyError = false;
    }

  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.requestPartsForm.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };

  // communicate the inner form validation to the parent form
  validate(_: UntypedFormControl) {
    return this.requestPartsForm.valid ? null : { requestPartsForm: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  showPartDetails() {
    let selectedPart = this.getSelectedPart(this.requestPartsForm.controls.partId.value);
    this.showDetails = true;
  }

}




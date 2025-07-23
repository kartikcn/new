import { Component, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { Enums } from 'src/app/model/enums.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { BuildingService } from '../../services/bl.service';
import { BuildingFilterInput } from '../../model/DTO/blFilterInput.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BuildingFilterInputDTO } from '../../model/DTO/BuildingFilterInputDTO.model';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-fl-form',
  templateUrl: './add-fl-form.component.html',
  styleUrls: ['./add-fl-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddFlFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddFlFormComponent),
      multi: true
    }
  ]
})
export class AddFlFormComponent implements ControlValueAccessor, OnDestroy {

  flFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumList: Enums[] = [];
  enumBL: any[] = [];
  enumComp: BuildingFilterInput[] = [];
  offsetBl:number = 0;
  limitBl:number = 0;
  filterCriteria:any = {
    fieldName: null, value: null, matchMode: "contains",limit:0,offset:0
  };
  prevBl:any;
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  @Input() isNew!: boolean;
  @Input() isView!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private blSrv: BuildingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.flFormPanel = this.formBuilder.group({
      blId: ['', [Validators.required]],
      flId: [null],
      flCode: ['', [Validators.required ]],
      flName: [''],
      flInfo: [''],
      svgName : [''],
      units : [''],
      externalArea: [''],
      internalArea: ['']
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.flFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    //this.loadBuilding();
    // this.loadCompany();
    //this.scrollToEndBl();
  }

  loadBuilding() {
    this.blSrv.getALLBuilding().subscribe((res: any) => {
      this.enumBL = res;
      // this.enumBL = res.map((i: any) => { i.name = i.blNameString; return i; });
      this.enumBL.unshift(new BuildingFilterInput('', 'Make a selection', '', 0));
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
    const flDetails: any = {
      blId: this.flFormPanel.controls.blId.value,
      flId: this.flFormPanel.controls.flId.value,
      flCode: this.flFormPanel.controls.flCode.value,
      flName: this.flFormPanel.controls.flName.value,
      flInfo: this.flFormPanel.controls.flInfo.value,
      svgName : this.flFormPanel.controls.svgName.value,
      units : this.flFormPanel.controls.units.value,
      externalArea : this.flFormPanel.controls.externalArea.value,
      internalArea : this.flFormPanel.controls.internalArea.value
    };
    return flDetails;
  }

  set value(value: any) {
    if(value.blId) {
      this.prevBl = value.bl;
      this.setPrevBl(this.prevBl);
    }
    setTimeout(() => {
      this.flFormPanel.patchValue({
        blId: value.blId,
        flId: value.flId,
        flCode: value.flCode,
        flName: value.flName,
        flInfo: value.flInfo,
        svgName : value.svgName,
        units : value.units,
        externalArea : value.externalArea,
        internalArea : value.internalArea
      });
    });
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.flFormPanel.reset();
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
    return this.flFormPanel.valid ? null : { flFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  unLinkFloorPlan() {
    if(this.flFormPanel.controls.svgName.value) {
      this.confirmationService.confirm({
        message: 'This will unlink the floor,rooms and assets links with this drawing. Please note that this action cannot be reversed. Are you sure you want to continue?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
         this.unLink();
        },
        key: "addFlForm"
      });
    }
   
  }

  unLink() {
    const flId = this.flFormPanel.controls.flId.value;
    this.blSrv.unLinkFloorPlan(flId).subscribe((res: any) => {
      this.messageService.clear();
      if (res.text = "Floor unlinked successfully") {
        setTimeout(() => {
          this.flFormPanel.patchValue({
            svgName : null,
          });
        }, 0);
        this.messageService.add({ key: 'rmSuccessMessage', severity: 'success', summary: 'Floor Plan unlinked successfully', detail: res.text });
      }
    })
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blSrv.getALLBuildingByScroll(this.filterCriteria).subscribe((res:any) => {
     this.enumBL = res;
     this.setPrevBl(this.prevBl);
    })
   }

   searchBl(event:any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
    this.scrollToEndBl();
   }

   setPrevBl(prevBl:any) {
    if(prevBl) {
      const blData:any = {
        blId:prevBl.blId,
        blNameString:prevBl.blCode + " - "+prevBl.blName,
        site:null
      }
      this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
    }
    this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
   }

   onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndBl();
  }

}

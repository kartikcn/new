import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { TradesService } from '../../../trades/services/trades.services';
import { Craftsperson } from '../../model/craftsperson.model';
import { CraftspersonService } from '../../services/craftsperson.service';
import { TradesDialogueProvider } from '../../../trades/provider/trades.provider';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-add-craftsperson-form',
  templateUrl: './add-craftsperson-form.component.html',
  styleUrls: ['./add-craftsperson-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddCraftspersonFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddCraftspersonFormComponent),
      multi: true
    }
  ]
})

export class AddCraftspersonFormComponent implements OnInit {
  cfFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumList: any[] = [];
  enumClonedList: any[] = [];
  enumCfData: any[] = [];
  enumStatus: any[] = [];
  enumWrType: any[] = [];
  enumYes: any[] = [];
  enumInHouseOrContractor: any[] = [];
  presentName: string = '';
  presentEmail: string = '';
  enumSupplierCode: any[] = [];
  isSupplierContractor: any;
  isContractorChecked: boolean = false;
  tradesData: any[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private enumsrv: EnumService,
    private cfSrv: CraftspersonService,
    private tradesService: TradesService,
    private tradesProvider: TradesDialogueProvider,

  ) {
    this.cfFormPanel = this.formBuilder.group({
      cfId: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      status: ['', [Validators.required, Validators.min(1)]],
      isSupervisor: ['', [Validators.required]],
      skills: [''],
      rateHourly: ['', [Validators.required, Validators.min(0)]],
      rateOver: ['', [Validators.required, Validators.min(0)]],
      rateDouble: ['', [Validators.required, Validators.min(0)]],
      stdHoursAvail: ['', [Validators.required, Validators.min(0)]],
      inHouseOrContractor: ['', [Validators.required, Validators.min(1)]],
      primaryTrade: ['', [Validators.required]],
    })
    this.subscriptions.push(
      this.cfFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  
  ngOnInit(): void {
    this.loadEnums();
    this.loadTrades();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumCfData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'craftsperson'.toLocaleUpperCase());
        this.enumStatus = this.enumCfData.filter(t => t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        this.enumStatus.unshift(new Enums(0, "", "", 'Make a selection'));
        this.enumYes = this.enumCfData.filter(t => t.fieldName.toLocaleUpperCase() === 'is_supervisor'.toLocaleUpperCase());
        this.enumInHouseOrContractor = this.enumCfData.filter(t => t.fieldName.toLocaleUpperCase() === 'in_house_or_contractor'.toLocaleUpperCase());
        this.enumInHouseOrContractor.unshift(new Enums(0, "", "", 'Make a selection'));
        this.enumInHouseOrContractor.forEach(t => {
          if (t.enumValue === 'Contractor') {
            this.isSupplierContractor = t.enumKey;
          }
        })
      },
      error => {

      }
    );
  }

  loadTrades() {
    this.tradesService.getAllTrades().subscribe((res: any) => {
      if (res) {
        this.tradesData = res;
        this.tradesData.unshift({tradeCode:"Make a Selection",tradeId:null})
      }
    })
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const craftsPersonDetails: any = {
      cfId: this.cfFormPanel.controls.cfId.value,
      name: this.cfFormPanel.controls.name.value,
      email: this.cfFormPanel.controls.email.value,
      phone: this.cfFormPanel.controls.phone.value,
      status: this.cfFormPanel.controls.status.value,
      isSupervisor: this.cfFormPanel.controls.isSupervisor.value,
      skills: this.cfFormPanel.controls.skills.value,
      rateHourly: this.cfFormPanel.controls.rateHourly.value,
      rateDouble: this.cfFormPanel.controls.rateDouble.value,
      rateOver: this.cfFormPanel.controls.rateOver.value,
      stdHoursAvail: this.cfFormPanel.controls.stdHoursAvail.value,
      inHouseOrContractor: this.cfFormPanel.controls.inHouseOrContractor.value,
      primaryTrade: this.cfFormPanel.controls.primaryTrade.value,
    };
    return craftsPersonDetails;
  }

  set value(value: Craftsperson) {
    setTimeout(() => {
      this.cfFormPanel.patchValue({
        cfId: value.cfId,
        name: value.name,
        email: value.email,
        phone: value.phone,
        status: value.status,
        isSupervisor: value.isSupervisor,
        skills: value.skills,
        rateHourly: value.rateHourly,
        rateDouble: value.rateDouble,
        rateOver: value.rateOver,
        stdHoursAvail: value.stdHoursAvail,
        inHouseOrContractor: value.inHouseOrContractor,
        primaryTrade: value.primaryTrade,
      });
      value.inHouseOrContractor === this.isSupplierContractor ? this.isContractorChecked = true : this.isContractorChecked = false;
    });
    this.onChange(value);
    this.onTouched();
  }

   writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.cfFormPanel.reset();
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

  validate(_: UntypedFormControl) {
    return this.cfFormPanel.valid ? null : { cfFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onAddTrade() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      isEdit: false,
      newRecord: true
    };
    this.tradesProvider.openDialog(dialogConfig);
    this.tradesProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.loadTrades();
        this.setLatestTrade(result);
      }
    });
  }

  setLatestTrade(tradeId: any) {
    setTimeout(() => {
      this.cfFormPanel.patchValue({
        primaryTrade: tradeId
      })
    }, 100)
  }

}

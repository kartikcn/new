import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EnumList } from 'src/app/model/enum-list.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { ConnectorService } from '../../services/connector.services';

@Component({
  selector: 'app-add-connector',
  templateUrl: './add-connector.component.html',
  styleUrls: ['./add-connector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddConnectorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddConnectorComponent),
      multi: true
    }
  ]
})
export class AddConnectorComponent {

  connectorFormPanel: FormGroup;
  subscriptions: Subscription[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumType: EnumList[] = [];
  enumFormat: EnumList[] = [];
  enumSeperator: EnumList[] = []
  tablesList: any[] = [];

  @Input() isNew!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private enumsrv: EnumService,
    private connectorService: ConnectorService
  ) {
    this.connectorFormPanel = this.formBuilder.group({
      connectorId: [null],
      connectorName: [null, [Validators.required]],
      tableName: [null, [Validators.required]],
      connectorType: [null, [Validators.required]],
      fileFormat: [null, [Validators.required]],
      seperator: [null, [Validators.required]],
      rowsToSkip: [null, [Validators.required]],
      connectionPath: [''],
      preProcess: [null],
      postProcess: []
    });
    this.subscriptions.push(
      this.connectorFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadEnums();
    this.loadTables();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: any[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.filter(t => t.tableName.toLocaleUpperCase() === 'conncetor'.toLocaleUpperCase());
        this.enumType = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'connector_type'.toLocaleUpperCase());
        this.enumType.unshift(new EnumList(null, "", "", 'Make a selection', null));
        this.enumFormat = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'file_format'.toLocaleUpperCase());
        this.enumFormat.unshift(new EnumList(null, "", "", 'Make a selection', null));
        this.enumSeperator = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'seperator'.toLocaleUpperCase());
        this.enumSeperator.unshift(new EnumList(null, "", "", 'Make a selection', null));
      },
      error => {
      });
  }

  loadTables() {
    this.connectorService.getAllTabes().subscribe((res: any) => {
      this.tablesList = res;
    })
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const eqDetails: any = {
      connectorId: this.connectorFormPanel.controls.connectorId.value,
      connectorName: this.connectorFormPanel.controls.connectorName.value,
      tableName: this.connectorFormPanel.controls.tableName.value,
      connectorType: this.connectorFormPanel.controls.connectorType.value,
      fileFormat: this.connectorFormPanel.controls.fileFormat.value,
      seperator: this.connectorFormPanel.controls.seperator.value,
      rowsToSkip: this.connectorFormPanel.controls.rowsToSkip.value,
      connectionPath: this.connectorFormPanel.controls.connectionPath.value,
      preProcess: this.connectorFormPanel.controls.preProcess.value,
      postProcess: this.connectorFormPanel.controls.postProcess.value,
    };
    return eqDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.connectorFormPanel.patchValue({
        connectorId: value.connectorId,
        connectorName: value.connectorName,
        tableName: value.tableName,
        connectorType: value.connectorType,
        fileFormat: value.fileFormat,
        seperator: value.seperator,
        rowsToSkip: value.rowsToSkip,
        connectionPath: value.connectionPath,
        preProcess: value.preProcess,
        postProcess: value.postProcess
      });
    });
    this.onChangeFormat(value.fileFormat);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.connectorFormPanel.reset();
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

  validate(_: FormControl) {
    return this.connectorFormPanel.valid ? null : { connectorFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChangeFormat(enumValue: any) {
    if (enumValue == "Excel") {
      this.connectorFormPanel.controls.seperator.setValue("None");
      this.connectorFormPanel.controls.seperator.disable();
    } else {
      this.connectorFormPanel.controls.seperator.enable()
    }
  }

}

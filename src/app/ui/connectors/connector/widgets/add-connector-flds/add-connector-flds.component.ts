import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ConnectorService } from '../../services/connector.services';
import { FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';

@Component({
  selector: 'app-add-connector-flds',
  templateUrl: './add-connector-flds.component.html',
  styleUrls: ['./add-connector-flds.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddConnectorFldsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddConnectorFldsComponent),
      multi: true
    }
  ]
})
export class AddConnectorFldsComponent implements OnInit {
  connectorFormPanel: FormGroup;
  subscriptions: Subscription[] = [];
  columnsList: any[] = [];
  tablesList: any[] = [];

  @Input() isNew!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private connectorService: ConnectorService
  ) {
    this.connectorFormPanel = this.formBuilder.group({
      connectorFldsId: [null],
      connectorId: [null, [Validators.required]],
      fieldName: [null, [Validators.required]],
      fieldTitle: [null, [Validators.required]],
      defaultValue: [null],
      refTable: [null],
    });
    this.subscriptions.push(
      this.connectorFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadColumns();
    this.loadTables();
  }

  loadColumns() {
    this.connectorService.getAllColumns().subscribe((res: any) => {
      this.columnsList = res;
    })
  }

  loadTables() {
    this.connectorService.getAllTabes().subscribe((res: any) => {
      this.tablesList = res;
    })
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const eqDetails: any = {
      connectorId: this.connectorFormPanel.controls.connectorId.value,
      connectorFldsId: this.connectorFormPanel.controls.connectorFldsId.value,
      fieldName: this.connectorFormPanel.controls.fieldName.value,
      fieldTitle: this.connectorFormPanel.controls.fieldTitle.value,
      defaultValue: this.connectorFormPanel.controls.defaultValue.value,
      refTable: this.connectorFormPanel.controls.refTable.value,
    };
    return eqDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.connectorFormPanel.patchValue({
        connectorId: value.connectorId,
        connectorFldsId: value.connectorFldsId,
        fieldName: value.fieldName,
        fieldTitle: value.fieldTitle,
        defaultValue: value.defaultValue,
        refTable: value.refTable,
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

}

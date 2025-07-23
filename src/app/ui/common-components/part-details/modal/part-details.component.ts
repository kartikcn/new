import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumList } from 'src/app/model/enum-list.model';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { PartsService } from 'src/app/ui/Helpdesk/parts/services/parts.service';

@Component({
  selector: 'app-part-details',
  templateUrl: './part-details.component.html',
  styleUrls: ['./part-details.component.scss']
})
export class PartDetailsComponent {
  frmPartsDetail: FormGroup;
  partsList: any[] = [];
  errorMsg: string = '';
  showDetails: boolean = false;
  enumConsumable:any[]=[];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumPartsData: EnumList[] = [];
  enumMeasurment:any[]=[];

  @Input() selectedPart:any;
  constructor(
    private formBuilder: FormBuilder,
    private enumsrv: EnumService,
  ) {
  
    this.frmPartsDetail = this.formBuilder.group({
      partCode: [''],
      description: [null],
      compId: [null],
      modelNo: [null],
      qutMinHand: [null],
      qutOnHand: [null],
      consumable: [null],
      qutOnOrder: [null],
      unitOfMeasurement: [null],
      ratePerUnit: [null],
    });
  }

  ngOnInit(): void {
    this.loadEnums();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumPartsData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase());
        this.enumConsumable = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'consumable'.toLocaleUpperCase());
        this.enumMeasurment = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'unit_of_measurement'.toLocaleUpperCase());
        this.setPartForm(this.selectedPart);
        },
     error => {
     }
    );
  }

  setPartForm(value: any) {
    setTimeout(() => {
      this.frmPartsDetail.patchValue({
        partCode: value.partCode,
        description: value.description,
        compId: value.compId,
        modelNo: value.modelNo,
        qutMinHand: value.qutMinHand,
        qutOnHand: value.qutOnHand,
        consumable: value.consumable,
        qutOnOrder: value.qutOnOrder,
        unitOfMeasurement: value.unitOfMeasurement,
        ratePerUnit: value.ratePerUnit,
        actualQuantityUsed: value.actualQuantityUsed
      });
    });
  }

}

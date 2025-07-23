import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { PartsDialogueProvider } from '../provider/parts.provider';
import { PartsService } from '../services/parts.service';
import { EnumService } from 'src/app/services/enum.service';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss'],
  providers: [MessageService]
})
export class PartsComponent implements OnInit {

  partsData: any[] = [];
  enumConsumable:EnumList[]=[];
  enumMeasurment:EnumList[]=[];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumPartsData: EnumList[] = [];
  isDefaultConsumable:any;
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["partId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];

  constructor(
    private partsProvider: PartsDialogueProvider,
    private partsService: PartsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private enumsrv: EnumService,
  ) { }

  ngOnInit(): void {
    this.loadEnums();
  }

  loadRecords() {
    this.loading = true;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.partsService.getAllPartsPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.partsData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.partsData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      isEdit: false,
      partId: null,
      newRecord: true,
      isDefaultConsumable:this.isDefaultConsumable,
    };
    this.partsProvider.openDialog(dialogConfig);
    this.partsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'partSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onEdit(partId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      partId: partId,
      isEdit: true,
      newRecord: false
    };
    this.partsProvider.openDialog(dialogConfig);
    this.partsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'partSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onDelete(parts: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete '+parts.partCode+'?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePart(parts.partId);
      },
      key: "partgrid"
    });
  }

  deletePart(partId: any) {
    this.partsService.deleteByPartCode(partId).subscribe((res: any) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'partSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords();
      } else {
        this.messageService.add({ key: 'partSave', severity: 'error', summary: 'error', detail: res.text });
      }
    },
      error => {
      }
    );
  }
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumPartsData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase());
        this.enumConsumable = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'consumable'.toLocaleUpperCase());
        this.enumMeasurment = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'parts'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'unit_of_measurement'.toLocaleUpperCase());
        this.enumConsumable.forEach(t => {
          if (t.enumValue === 'Yes') {
            this.isDefaultConsumable = t.enumKey;
          }
        })
        this.loadRecords();
        },
     error => {
     }
    );
  }
  getEnumById(id: any) {
    return this.enumConsumable.find((t: any) => t.enumKey === id)?.enumValue
  }

  getUnitOfMeasurementById(id: any) {
    return this.enumMeasurment.find((t: any) => t.enumKey === id)?.enumValue
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onInnerFilter(event: any) {
    if (this.isFiltered) {
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if(filterValue !== undefined){
          let filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadRecords();
    }
    this.isFiltered = true;
  }

  updateFilterCriteriaList(filterCriteria:any){
    let index = this.filterCriteriaList.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if(filterCriteria['value']==null){
      if(index !==-1){
        this.filterCriteriaList.splice(index, 1);
      }
    }else {
      if (index !== -1) {
        this.filterCriteriaList[index] = filterCriteria;
      } else {
        this.filterCriteriaList.push(filterCriteria);
      }
    }
  }

}

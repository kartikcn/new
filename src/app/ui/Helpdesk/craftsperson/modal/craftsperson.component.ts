import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { craftsPersonDialogueProvider } from '../provider/craftsperson.provider';
import { CraftspersonService } from '../services/craftsperson.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-craftsperson',
  templateUrl: './craftsperson.component.html',
  styleUrls: ['./craftsperson.component.scss'],
  providers: [MessageService]
})
export class CraftspersonComponent implements OnInit {
  cf_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  enumstatus: any[] = [];
  enumList: any[] = [];
  enumClonedList: any[] = [];
  enumCraftsPerson: any[] = [];
  enumsYesOrNo: any[] = [];
  isSupervisor: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["cfId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  constructor(
    private service: CraftspersonService,
    private craftsPersonDilogueProvider: craftsPersonDialogueProvider,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private enumsrv: EnumService
  ) {

  }

  ngOnInit(): void {
    this.loadEnums();
    this.loadRecords();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: any[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumCraftsPerson = this.enumClonedList.filter(t => t.tableName.toLowerCase() === 'craftsperson'.toLowerCase()); // need to change table name Here!!
        this.enumstatus = this.enumClonedList.filter(t =>t.tableName.toLowerCase() === 'craftsperson'.toLowerCase() && t.fieldName.toLowerCase() === 'status'.toLowerCase());
        this.enumsYesOrNo = this.enumClonedList.filter(t =>t.tableName.toLowerCase() === 'craftsperson'.toLowerCase() && t.fieldName.toLowerCase() === 'is_supervisor'.toLowerCase());
        this.enumsYesOrNo.forEach(t => {
          if (t.enumValue === 'No') {
            this.isSupervisor = t.enumKey;
          }
        })
      },
      error => {

      }
    );
  }

  loadRecords() {
    this.loading = true;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.service.getAllCraftspersonPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.cf_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.cf_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  getNameById(enumKey: any) {
    return enumKey ? this.enumstatus.find(t => t.enumKey == enumKey) != null ? this.enumstatus.find(t => t.enumKey == enumKey )?.enumValue : '' : '';
  }

  onAddCf() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      cfId: null,
      isEdit: true,
      newRecord: true,
      isSupervisor: this.isSupervisor,
      enumsYesOrNo: this.enumsYesOrNo,
    };
    this.craftsPersonDilogueProvider.openDialog(dialogConfig);
    this.craftsPersonDilogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result === true) {
        this.messageService.clear();
        this.messageService.add({ key: 'cfSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onEditCf(cfId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      cfId: cfId,
      isEdit: true,
      newRecord: false
    };
    this.craftsPersonDilogueProvider.openDialog(dialogConfig);
    this.craftsPersonDilogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.messageService.clear();
        this.messageService.add({ key: 'cfSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onDelete(id: any, name: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + name + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCf(id);
      },
      key: "cfGrid"
    });
  }

  deleteCf(id: any) {
    this.service.deleteById(id).subscribe((res: any) => {
      this.messageService.clear();
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'cfSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords();
      } else {
        this.messageService.add({ key: 'cfSave', severity: 'error', summary: 'error', detail: res.text });
      }
    },
      error => {

      }
    );

  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onInnerFilter(event: any) {
    if(this.isFiltered){
      this.filterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
          let filterCriteria={}
          if(field=="primaryTrade"){
            filterCriteria = { fieldName: "trades.tradeCode", value: filterValue, matchMode: matchMode };
          }else{
            filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
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

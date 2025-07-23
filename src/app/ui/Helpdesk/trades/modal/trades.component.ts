import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { TradesDialogueProvider } from '../provider/trades.provider';
import { TradesService } from '../services/trades.services';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss'],
  providers: [MessageService]
})
export class TradesComponent implements OnInit {
  tradesData: any[] = [];
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["tradeId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];

  constructor(
    private tradesProvider: TradesDialogueProvider,
    private messageService: MessageService,
    private tradesService: TradesService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.tradesService.getAllTradesPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.tradesData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.tradesData = [];
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
      newRecord: true
    };
    this.tradesProvider.openDialog(dialogConfig);
    this.tradesProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'tradeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onEditTrade(tradeId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      tradeId: tradeId,
      isEdit: true,
      newRecord: false
    };
    this.tradesProvider.openDialog(dialogConfig);
    this.tradesProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result)
      this.messageService.add({ key: 'tradeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
      this.loadRecords();
    });
  }

  onDelete(trade: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete '+trade.tradeCode+'?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTrade(trade.tradeId);
      },
      key: "tradeGrid"
    });
  }

  deleteTrade(tradeId: any) {
    this.tradesService.deleteById(tradeId).subscribe((res: any) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'tradeSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords();
      } else {
        this.messageService.add({ key: 'tradeSave', severity: 'error', summary: 'error', detail: res.text });
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

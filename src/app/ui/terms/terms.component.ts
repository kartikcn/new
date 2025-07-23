import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { TermsService } from './services/terms.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { TermsDialogueProvider } from './providers/terms.provider';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  providers: [MessageService]
})
export class TermsComponent {

  termsRecords: [] = [];
  loadingRec: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["termId"],
    sortOrder:"ASC"
  }
  totalElements:number = 0;
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  isSorted : boolean = false;
  constructor(
    private termsservice:TermsService,
    private termsDialogue: TermsDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(){
    this.loadingRec= true;
    this.isFiltered = false;
    let data = {paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.termsservice.getAllTermsPaginated(data).subscribe((res:any)=>{
      if(res.status!=202){
        this.loadingRec= false;
        this.isFiltered = false;
        this.termsRecords =  res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }else{
        this.loadingRec= true;
        this.termsRecords = [];
      }
    })
  }

  addRecord(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      termId:0,
      term: "",
      dateFrom: null,
      dateTo: null,
      isEdit: true,
      newRecord: true,
      title: "Add",
      comments:null
    };
    this.termsDialogue.openDialog(dialogConfig);
    this.termsDialogue.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.loadRecords();
      }
    });
  }

  openEditItem(term:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      termId:term.termId,
      term: term.term,
      dateFrom: term.dateFrom,
      dateTo: term.dateTo,
      isEdit: true,
      newRecord: false,
      title: "Edit",
      comments:term.comments
    };
    this.termsDialogue.openDialog(dialogConfig);
    this.termsDialogue.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.loadRecords();
      }
    })
  }

  onDelete(term: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete '+term.term+'?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(term);
      },
      key: "termDetails"
    });
  }

  deleteRecord(term:any){
    this.messageService.clear();
    this.termsservice.deleteTerm(term).subscribe((res:any)=>{
      if(res.code == 200){
        this.messageService.add({ key: 'termMessage', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        setTimeout(()=>{
          this.loadRecords();
        },1000)
      }
      else{
        this.messageService.add({ key: 'termMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
        setTimeout(()=>{
          this.loadRecords();
        },1000)
      }
    })
  }

  onPageChange(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onSort(event: any) {
   // this.isSorted = true;
  }

  onInnerFilter(event: any) {
    this.isSorted = false;
    if(this.isFiltered && !this.isSorted){
      this.isSorted = false;
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
          let filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      // if(this.filterCriteriaList.length!=0){
      //   this.paginationObj.pageNo = 0;
      // }
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

import { Component, OnInit, ViewEncapsulation, Inject, Input, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { UserDetailsList } from 'src/app/model/user-details-list.model';
import { EnumService } from 'src/app/services/enum.service';
import { RmcatService } from 'src/app/services/rmcat.service';
import { SiteService } from 'src/app/services/site.service';
import { RmcatModalDialogueProvider } from '../../provider/rmcat.provider';
import { RmcatFilterInput } from '../rmcatFilterInput.model';
import { UtilConstant } from '../../../../../common/UtilConstant';


declare var $ : any;
@Component({
  selector: 'app-rmcat',
  templateUrl: './rmcat.component.html',
  styleUrls: ['./rmcat.component.scss'],
  providers: [MessageService]
})

export class RmcatComponent implements OnInit {

  //rmcatFilterPanel: FormGroup;
  confirmationResult: any;
  EnumList: Enums[] = [];
  enumClonedList: Enums[]=[];
  enumCC_stat: Enums[] = [];
  enumRmcats: RmcatFilterInput[]=[];
  GLACCList: Enums[] = [];
  rmstd_data: any[] = [];
  selectedUser!:RmcatFilterInput;
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isRmstdListLoad: boolean = true;
  rmcatFilter!:RmcatFilterInput
  displayedColumns: string[] = ['SiteId','siteName', 'long', 'lat', 'siteInfo','sitePhoto','ctryId','stateId','regnId','cityId'];
  dataSource!: MatTableDataSource<UserDetailsList>;
  rowCount: number = UtilConstant.ROW_COUNT;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @Output() parentFun = new EventEmitter();
  constructor(
    private fb: UntypedFormBuilder,
    private enumsrv: EnumService,
    private router: Router,
    private rmcatSrv:RmcatService,
    private rmcatModalDialogueProvider: RmcatModalDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    
  ) { 
  }

  ngOnInit() {
     //this.loadRmcats();
  }

  /*loadRmcats(){
    this.rmcatSrv.getALLRmcats().subscribe((res:any[])=>{
      this.enumRmcats = res;
      console.log("list return"+this.enumRmcats);

      this.enumRmcats = res.map((i:any) => { i.rmCatDesc = i.rmCat + ' - ' + i.rmCatDesc; return i; });
      this.enumRmcats.unshift(new RmcatFilterInput('', 'Make a selection', ));
    });
  }
  
  onClear() {
    
    for (var fieldId in this.rmcatFilterPanel.controls) {
      this.rmcatFilterPanel.controls[fieldId].setValue(null);
    }
    this.isRmstdListLoad = true;
    this.rmstd_data = [];
    this.loadRecords(new RmcatFilterInput("",""));
  }
  onFilter(formData: FormGroup) {
    var code = formData.controls.rmCat.value;
    code = code != null ? code.substring(code.indexOf("-") + 1, code.length).trim() : "";
    let postData = {
      rmCat: code,
      rmCatDesc:""
    }
    this.loadRecords(postData);
  }*/
  
  loadRecords(data: RmcatFilterInput) {
   
    this.rmcatFilter = data;
    this.loading = true;
    this.isRmstdListLoad = true;
    this.rmcatSrv.getRmcatList(data).subscribe((res: any) => {
      if (res.status != 202) {
        this.isRmstdListLoad = false;
        this.rmstd_data = res;
      }
      else {
        this.isRmstdListLoad = true;
        this.rmstd_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }
  
  openEditItem(rmCat:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      rmCat: rmCat,
      isEdit: true,
      newRecord: false,
      title: "Edit"
    };
    this.rmcatModalDialogueProvider.openDialog(dialogConfig);
    this.rmcatModalDialogueProvider.onDialogueClosed.subscribe((result:any)=>{
      if(result == true)
        this.loadRecords(this.rmcatFilter);
    })
  }

 //add button code
  openAddItem() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '500px';
  dialogConfig.data = {
    rmCat: null,
    isEdit: true,
    newRecord: true,
    title:"Add"
  };
  this.rmcatModalDialogueProvider.openDialog(dialogConfig);
  this.rmcatModalDialogueProvider.onDialogueClosed.subscribe((result:any)=>{
    if (result == true)
      this.loadRecords(this.rmcatFilter);
  })
  }

  writeValue(value:any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      // this.frmEquipmentPositionDetails.reset();
    }
  }

  registerOnChange(fn:any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  /// Start Of UI Related Non-Trivial Functionality ///
   clear(table:Table){
     table.clear()
   }
  onRowSelect(event:any){
    this.parentFun.emit(event.data);
  }
  deleteRoomCat(rm_cat:string):void{
    this.userDeleteConfirm(rm_cat);
  }
  deleteRecord(rm_cat: string) {

    this.rmcatSrv.deleteRoomCat(rm_cat).subscribe((res: any) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'rmCatMessage', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.rmcatFilter);
        this.parentFun.emit(this.rmcatFilter)
      }

    });
  }
  userDeleteConfirm(rm_cat: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + rm_cat + ' ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(rm_cat);
      },
      key: "rmCatGrid"
    });
  }
}

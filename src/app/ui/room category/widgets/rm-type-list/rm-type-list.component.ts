import { Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Subscription } from 'rxjs';
import { RmTypeList } from '../../model/rmtype-list.model';
import { RmTypeFilterInputDTO } from '../../model/DTO/rmTypeFilterInput.model';
import { RmcatService } from '../../../../services/rmcat.service';
import { RmTypeModalDialogueProvider } from '../../provider/rmtype.provider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from '../../../../../common/UtilConstant';

@Component({
  selector: 'app-rm-type-list',
  templateUrl: './rm-type-list.component.html',
  styleUrls: ['./rm-type-list.component.scss'],
  providers: [MessageService]
})
export class RmTypeListComponent implements OnInit {

  confirmationResult: any;
  rmType_data: any[] = [];
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isRmTypeList: boolean = true;
  displayedColumns: string[] = ['id', 'rmType', 'rmCat', 'rmTypeDesc'];
  selectedRmStandard: string = '';
  isHide: boolean = true
  rmCat: string = ''
  dataSource!: MatTableDataSource<RmTypeList>;
  rowCount: number = UtilConstant.ROW_COUNT;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @Output() parentFun = new EventEmitter();
  constructor(
    private service: RmcatService,
    private rmTypeProvider: RmTypeModalDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
  }

  loadRecords(data: RmTypeFilterInputDTO) {
    this.loading = true;
    this.isRmTypeList = true;
    this.rmType_data = [];
    this.rmCat = data.rmCat
    this.selectedRmStandard = "Room Standard: " + data.rmCat;
    this.service.getRmTypeList(data).subscribe((res: any) => {
      if (res.status != 202) {
        this.isRmTypeList = false;
        this.rmType_data = res;
      }
      else {
        this.isRmTypeList = true;
        this.rmType_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(rmtype: any, rmcat: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      rmtype: rmtype,
      rmcat: rmcat,
      isEdit: true,
      newRecord: false
    };
    this.rmTypeProvider.openDialog(dialogConfig);
    this.rmTypeProvider.onDialogueClosed.subscribe((result: any) => {
      //this.loadRecords(new RmTypeFilterInputDTO("", "", ""));
      this.isHide = true 
      if(result == true){
        //this.loadRecords(new RmTypeFilterInputDTO("", "", this.rmCat));
        if(this.rmCat != ''){
          this.isHide = false;
          this.selectedRmStandard = "Room Standard: " + this.rmCat
        }else{
          this.isHide = true
        
        }
        
      }else if(result == 'saved'){
        if(this.rmCat != ''){
          this.parentFun.emit(this.rmCat)
        }else{
          this.loadRecords(new RmTypeFilterInputDTO("", "", ""));
        }
        
      }
      else{
        this.parentFun.emit(this.rmCat)
      }
      

    })
  }

  onAddRoomType() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      rmtype: null,
      rmcat: null,
      isEdit: true,
      newRecord: true
    };
    this.rmTypeProvider.openDialog(dialogConfig);
    this.rmTypeProvider.onDialogueClosed.subscribe((result: any) => {
      this.isHide = true 
      if(result == true){
        //this.loadRecords(new RmTypeFilterInputDTO("", "", this.rmCat));
        if(this.rmCat != ''){
          this.isHide = false;
          this.selectedRmStandard = "Room Standard: " + this.rmCat
        }else{
          this.isHide = true;
          
        }
        
      }else if(result == 'saved' || 'deleted'){

       if(this.rmCat != ''){
          this.parentFun.emit(this.rmCat)
        }else{
          this.loadRecords(new RmTypeFilterInputDTO("", "", ""));
        }
        
      }
      else{
        this.parentFun.emit(this.rmCat)
      }
      
      
    })
  }

  onRowSelect(event: any) {
    //this.parentFun.emit(event.data);
  }
  onClearRmStandard(){
    this.parentFun.emit(true);
    this.isHide = true;
  }
  deleteRoomType(rm_type: string, rm_cat:string){
    this.userDeleteConfirm(rm_type, rm_cat);
  }
  deleteRecord(rmtype: string,rm_cat:string) {
    let data = new RmTypeFilterInputDTO(rmtype, "", rm_cat);
    this.service.deleteRoomType(data).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'rmTypeMessage', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        if(this.rmCat != ''){
          this.parentFun.emit(this.rmCat)
        }else{
          this.loadRecords(new RmTypeFilterInputDTO("", "", ""));
        }
      }

    });
  }
  userDeleteConfirm(rm_type: string, rm_cat: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + rm_type + ' ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecord(rm_type,rm_cat);
      },
      key: "rmTypeGrid"
    });
  }
}

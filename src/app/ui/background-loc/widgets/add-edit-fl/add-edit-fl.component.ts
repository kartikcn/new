import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BuildingService } from '../../services/bl.service';
import { FLList } from '../../model/fl-list.model';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-add-edit-fl',
  templateUrl: './add-edit-fl.component.html',
  styleUrls: ['./add-edit-fl.component.scss'],
  providers: [MessageService]
})
export class AddEditFlComponent implements OnInit {

  frmFlDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  isView: boolean = false;
  title: string = 'Add';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditFlComponent>,
    private blSrv: BuildingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.frmFlDetail = this.formBuilder.group({
      flFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
      this.disableButton();
      this.isNewRecord();
    }
  }

  disableButton() {
    if (this.data.isEdit != null && !this.data.isEdit) {
      this.isEdit = false;
    }
  }
  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord;
      if (!this.isNew)
        this.title = 'Edit';
    }
    if(this.data.isView != null){
      this.isView = this.data.isView
      if(this.isView)
        this.title = ""
    }
  }
  loadData() {
    const calls = [];
    if (this.data.fl_id != null) {
      
      calls.push(this.blSrv.getFlById(this.data.fl_id));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe((results:any) => {
      if (results[0] == null) {
        var flData = {
          blId: this.data.bl_id,
          flId: null,
          flName: null,
          flInfo: null,
          svgName : null,
          units : null,
          externalArea : null,
          internalArea : null
        }
        setTimeout(() => {
          this.frmFlDetail.patchValue({
            flFormPanel: flData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.frmFlDetail.patchValue({
            flFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
  
  saveRecords() {
    if (this.frmFlDetail.valid) {
      const flData: FLList = this.frmFlDetail.controls.flFormPanel.value;
      this.blSrv.saveFloor(flData).subscribe((res: any) => {
        if (res.code == 200) {
          if (this.isNew) {
            this.messageService.add({ key: 'flSuccessMessage', severity: 'success', summary: 'Record added', detail: res.text });
          } 
          else {
            this.messageService.add({ key: 'flSuccessMessage', severity: 'success', summary: 'Record updated', detail: res.text });
          }
          setTimeout(() => {
            this.dialogRef.close(res.data);
          }, 1000)
        }else {
          this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
         }
      }
      );
    }
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key:'flDetails'
    });
  }

  clearForm() {
    this.frmFlDetail.controls.flFormPanel.reset();
  }
  deleteRecord(){
    this.userDeleteConfirm();
  }
  deleteSiteRecord(fl_id:string) {
    
    this.blSrv.deleteFloor(fl_id).subscribe((res:any) => {
     
      if (res.code == 200) {
        this.messageService.add({ key: 'flSuccessMessage', severity: 'success', summary: 'Record deleted successfully', detail: res.text });
        setTimeout(()=>{
          this.dialogRef.close(true);
        },1000)
      }else{
        this.messageService.add({ key: 'flFailureMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
        setTimeout(()=>{
          this.dialogRef.close(true);
        },1000)
      }

    });
  }
  userDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + this.data.bl_id + ' - ' + this.data.flCode+ ' ?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteSiteRecord(this.data.fl_id);
      },
      key: 'flDetails'
    });
  }
}

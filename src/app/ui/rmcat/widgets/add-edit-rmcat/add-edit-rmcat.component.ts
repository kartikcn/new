import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import {  ConfirmBoxDialogComponent } from 'src/app/confirm-box-dialog/confirm-box-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { EnumService } from 'src/app/services/enum.service';
import { SiteService } from 'src/app/services/site.service';
import { ConfirmBoxDialogModel } from 'src/app/model/confirm-dialog.model';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { SiteDetailsList } from 'src/app/model/site-details-list.model';
import { RmcatService } from 'src/app/services/rmcat.service';
import { RmcatDetailsList } from 'src/app/model/rmcat-details-list.model';
import { UtilConstant } from '../../../../../common/UtilConstant';

@Component({
     selector: 'app-add-edit-rmcat',
     templateUrl: './add-edit-rmcat.component.html',
     styleUrls: ['./add-edit-rmcat.component.scss']
   })
export class AddEditRmcatComponent implements OnInit {

  frmRmcatDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean= true;
  title="";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRmcatComponent>,
    private enumsrv: EnumService,
    private siteSrv: SiteService,
    private rmcatSrv: RmcatService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) {
    this.frmRmcatDetail = this.formBuilder.group({
      rmcatFormPanel: []
    });
  }

  ngOnInit() {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.title = this.data.title;
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
      this.isNew = this.data.newRecord
    }
  }
  loadData() {
    const calls = [];
    if (this.data.rmCat != null) {
     calls.push(this.rmcatSrv.getRmcatById(this.data.rmCat));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      
      if (results[0] == null) {
        let data ={
          rmCat:'',
          rmCatDesc:'',
          highlightColor:'#a6a6a6'
        }
        setTimeout(() => {
          this.frmRmcatDetail.patchValue({
            rmcatFormPanel: data
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.frmRmcatDetail.patchValue({
            rmcatFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
 
  saveRecords() {
    
    if (this.frmRmcatDetail.valid) {
      const rmcatData: RmcatDetailsList = this.frmRmcatDetail.controls.rmcatFormPanel.value;
      this.rmcatSrv.saveRmcat(rmcatData).subscribe((res: any) => {
        if (res.status != 202) {
          this.toastr.success("Record saved Successfully.");
          this.dialogRef.close(true);
        }
      },
        error => {
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
      key:'rmcatForm'
    });
  
  }

  deleteRecord(){
    this.userDeleteConfirm();
  }

  deleteSiteRecord() {
    
    this.rmcatSrv.deleteRoomCat(this.data.rmCat).subscribe((res) => {
      if (res != null && res.code == 200) {
        //  this.messageService.add({ key: 'siteDetailsMessage', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.dialogRef.close(true);
      }

    });
  }
  userDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + this.data.rmCat  + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteSiteRecord();
      },
      key: 'rmcatForm'
    });
  }

}


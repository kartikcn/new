import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { SiteService } from 'src/app/services/site.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SiteDetailsList } from 'src/app/model/site-details-list.model';
import { AddSiteItemComponent } from '../add-site-item/add-site-item.component';
import { UsersService } from '../../../../services/users.service';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-edit-site',
  templateUrl: './add-edit-site.component.html',
  styleUrls: ['./add-edit-site.component.scss'],
  providers: [MessageService]
})
export class AddEditSiteComponent implements OnInit {

  frmSiteDetail: UntypedFormGroup;

  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  isView: boolean = false;
  title: string = 'Add';
  initialsiteFormPanel : any;
  @ViewChild(AddSiteItemComponent, { static: false }) sitePanel!: AddSiteItemComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditSiteComponent>,
    private siteSrv: SiteService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public userSrv: UsersService,
  ) {
    this.frmSiteDetail = this.formBuilder.group({
      siteFormPanel: []
    });
  }

  ngOnInit() {
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
      this.isNew = this.data.newRecord
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
    if (this.data.siteId != null) {
     calls.push(this.siteSrv.getSiteById(this.data.siteId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe((results:any) => {
      
      if (results[0] == null) {
        
      } else {
        setTimeout(() => {
          if (results[0].hasOwnProperty('sitePhoto')) {
            this.sitePanel.site_img = "data:image/png;base64," + results[0].sitePhoto; 
          }
          this.frmSiteDetail.patchValue({
            siteFormPanel: results[0].site
          });
          this.initialsiteFormPanel = results[0].site;
          delete this.initialsiteFormPanel.doc;
          delete this.initialsiteFormPanel.compId;
        }, 0);
      }
    });
  }
 
  saveRecords() {
    if (this.frmSiteDetail.valid) {
      this.messageService.clear();
      const siteData: SiteDetailsList = this.frmSiteDetail.controls.siteFormPanel.value;
      if (this.sitePanel.isPhotoUploaded) {
        this.uploadSitePhoto(siteData.siteId);
      }
      this.siteSrv.saveSite(siteData).subscribe((res: any) => {
        if (res.code == 200) {
          if (this.isNew) {
            this.messageService.add({ key: 'siteSuccessMessage', severity: 'success', summary: 'Record added', detail: res.text });
          } 
          else {
            this.messageService.add({ key: 'siteSuccessMessage', severity: 'success', summary: 'Record updated', detail: res.text });
          }
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000)
        }else {
          this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
         }
      },
        () => {
        }
      );
    }
  }
  uploadSitePhoto(id: any) {
    const uploadData = new FormData();
    uploadData.set('imageFile', this.sitePanel.selectedFile, this.sitePanel.selectedFile.name);
    uploadData.set("tableName", 'site');
    uploadData.set("fieldName", 'site_photo');
    uploadData.set("pkeyValue", id);
    uploadData.set("imageName", this.sitePanel.selectedFile.name);

    this.userSrv.uploadProfilePhto(uploadData).subscribe((res:any) => {
      console.log(res);
    });
  }

  confirmDialog(): void {
      this.confirmationService.confirm({
        message: UtilConstant.CANCEL_Msg,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.dialogRef.close();
         // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        key:'siteDetails'
      });
    }
  

  deleteRecord(){
    this.userDeleteConfirm();
  }
  deleteSiteRecord(siteId: string) {
    this.siteSrv.deleteSite(siteId).subscribe((res:any) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'siteSuccessMessage', severity: 'success', summary: 'Record deleted successfully', detail: res.text });
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000)
      }
      else{
        this.messageService.add({ key: 'siteFailureMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000)
      }

    });
  }
  userDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + this.data.siteCode + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteSiteRecord(this.data.siteId);
      },
      key: 'siteDetails'
    });
  }

}

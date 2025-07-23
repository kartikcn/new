import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { BuildingService } from '../../services/bl.service';
import { BLList } from '../../model/bl-list.model';
import { AddBlFormComponent } from '../add-bl-form/add-bl-form.component';
import { UsersService } from '../../../../services/users.service';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-add-edit-bl',
  templateUrl: './add-edit-bl.component.html',
  styleUrls: ['./add-edit-bl.component.scss'],
  providers: [MessageService]

})
export class AddEditBlComponent implements OnInit {

  frmBlDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  isView: boolean = false;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  @ViewChild(AddBlFormComponent, { static: false }) blPanel!: AddBlFormComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditBlComponent>,
    private blSrv: BuildingService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    public userSrv: UsersService,
    private messageService: MessageService,
  ) {
    this.frmBlDetail = this.formBuilder.group({
      blFormPanel: []
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
    if (this.data.isView != null) {
      this.isView = this.data.isView
      if (this.isView)
        this.title = ""
    }
  }
  loadData() {
    const calls = [];
    if (this.data.bl_id != null) {
      calls.push(this.blSrv.getBlById(this.data.bl_id));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var blData = {
          blId: null,
          siteId: null,
          blName: null,
          blInfo: null,
          longitude: null,
          latitude: null,
          blContactName: null,
          blContactPhone: null,
          timeZoneId: 'UTC',
        }

        setTimeout(() => {
          this.frmBlDetail.patchValue({
            blFormPanel: blData
          });
        }, 0);

      } else {
        setTimeout(() => {
          if (results[0].blPhoto != null) {
            this.blPanel.bl_img = "data:image/png;base64," + results[0].blPhoto;
          }
          this.frmBlDetail.patchValue({
            blFormPanel: results[0].bl
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    this.messageService.clear();
    if (this.frmBlDetail.valid) {
      const blData: BLList = this.frmBlDetail.controls.blFormPanel.value;
      if (this.blPanel.isPhotoUploaded) {
        this.uploadBlPhoto(blData.blId);
      }
      this.blSrv.saveBuilding(blData).subscribe((res: any) => {
        if (res.code == 200) {
          if (this.isNew) {
            this.messageService.add({ key: 'blSuccessMessage', severity: 'success', summary: 'Record added', detail: res.text });
          } 
          else {
            this.messageService.add({ key: 'blSuccessMessage', severity: 'success', summary: 'Record updated', detail:  res.text });
          }
          setTimeout(() => {
            this.dialogRef.close([true, res.data]);
          }, 1000)
        }else {
          this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
         }
      },
        error => {
        }
      );
    }

  }

  uploadBlPhoto(id: any) {
    const uploadData = new FormData();
    uploadData.set('imageFile', this.blPanel.selectedFile, this.blPanel.selectedFile.name);
    uploadData.set("tableName", 'bl');
    uploadData.set("fieldName", 'bl_photo');
    uploadData.set("pkeyValue", id);
    uploadData.set("imageName", this.blPanel.selectedFile.name);
    this.userSrv.uploadProfilePhto(uploadData).subscribe((res) => {
      console.log(res);
    });
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: 'blDetails'
    });
  }

  clearForm() {
    this.frmBlDetail.patchValue({
      blFormPanel: {
        blId: null,
        siteId: null,
        blName: null,
        blInfo: null,
        longitude: null,
        latitude: null,
        blContactName: null,
        blContactPhone: null,
        timeZoneId: 'UTC',
      }
    });
  }
  deleteRecord() {
    this.userDeleteConfirm();
  }
  deleteSiteRecord(bl_id: string) {
    
    this.blSrv.deleteBuilding(bl_id).subscribe((res) => {
      if (res.code == 200) {
        this.messageService.add({ key: 'blSuccessMessage', severity: 'success', summary: 'Record deleted', detail: res.text });
        setTimeout(() => {
          this.dialogRef.close([true]);
        }, 1000)
      }
      else {
        this.messageService.add({ key: 'blFailureMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
        setTimeout(() => {
          this.dialogRef.close([true]);
        }, 1000)
      }

    });
  }
  userDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + this.data.blCode + ' ?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteSiteRecord(this.data.bl_id);
      },
      key: 'blDetails'
    });
  }

}

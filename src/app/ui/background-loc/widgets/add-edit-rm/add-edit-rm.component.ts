import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BuildingService } from '../../services/bl.service';
import { AddRmFormComponent } from '../add-rm-form/add-rm-form.component';
import { UsersService } from '../../../../services/users.service';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-add-edit-rm',
  templateUrl: './add-edit-rm.component.html',
  styleUrls: ['./add-edit-rm.component.scss'],
  providers: [MessageService]
})
export class AddEditRmComponent implements OnInit {

  frmRmDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  isView: boolean = false;
  title: string = 'Add';
 
  @ViewChild(AddRmFormComponent, { static: false }) rmPanel!: AddRmFormComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRmComponent>,
    private blSrv: BuildingService,
    private confirmationService: ConfirmationService,
    public userSrv: UsersService,
    private messageService: MessageService,
  ) {
    this.frmRmDetail = this.formBuilder.group({
      rmFormPanel: []
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
        this.title = "";
        
    }
  }
  loadData() {
    const calls = [];
    if (this.data.rm_id != null) {
      calls.push(this.blSrv.getRmById(this.data.rm_id));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe((results:any) => {
      if (results[0] == null) {
        var rmData = {
          blId: this.data.bl_id,
          flId: this.data.fl_id,
          rmId: null,
          rmName: null,
          rmInfo: null,
          rmCat: null,
          rmType: null,
          rmArea: null,
          rmPhoto1: null,
          rmPhoto2: null,
          isReservable : null,
          isHotelable : null,
          svgElementId : null,
          divId:null,
          depId:null,
          commonAreaType:null,
          emCapacity:null,
          rmAreaManual: null,
          isOccupiable: null,
          spaceStandard:null,
          rmUse:null,
          subDepId:null
        };
        setTimeout(() => {
          this.frmRmDetail.patchValue({
            rmFormPanel: rmData,
          });
        }, 0);

      } else {
        setTimeout(() => {
          if (results[0].rmPhoto != null) {
            this.rmPanel.rm_img = "data:image/png;base64," + results[0].rmPhoto;
          }
          this.frmRmDetail.patchValue({
            rmFormPanel: results[0].rm
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    if (this.frmRmDetail.valid) {
      this.messageService.clear();
      const rmData: any =this.frmRmDetail.controls.rmFormPanel.value;
      if (this.rmPanel.isPhotoUploaded) {
        var pkeyVal = rmData.rmId;
        this.uploadRmPhoto(pkeyVal);
      }
      this.blSrv.saveRoom(rmData).subscribe((res: any) => {
        if (res.code == 200) {
          if (this.isNew) {
            this.messageService.add({ key: 'rmSuccessMessage', severity: 'success', summary: 'Record added', detail: res.text });
          } 
          else {
            this.messageService.add({ key: 'rmSuccessMessage', severity: 'success', summary: 'Record updated', detail: res.text });
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

  uploadRmPhoto(pkeyVal: any) {
    const uploadData = new FormData();
    uploadData.set('imageFile', this.rmPanel.selectedFile, this.rmPanel.selectedFile.name);
    uploadData.set("tableName", 'rm');
    uploadData.set("fieldName", 'rm_photo');
    uploadData.set("pkeyValue", pkeyVal);
    uploadData.set("imageName", this.rmPanel.selectedFile.name);
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
        this.dialogRef.close(false);
      },
      key:'rmDetails'
    });
  }

  clearForm() {
    this.frmRmDetail.controls.rmFormPanel.reset();
  }
  deleteRecord():void{
    this.userDeleteConfirm();
  }
  deleteSiteRecord() {
    this.messageService.clear();
    this.blSrv.deleteRoom(this.data.rm_id).subscribe((res:any) => {
      if (res.code == 200) {
         this.messageService.add({ key: 'rmSuccessMessage', severity: 'success', summary: 'Record deleted', detail: res.text });
        setTimeout(()=>{
          this.dialogRef.close(true);
        },1000)
      }
      else{
        this.messageService.add({ key: 'rmFailureMessage', severity: 'warn', summary: 'Delete failed', detail: res.text });
        setTimeout(()=>{
          this.dialogRef.close(true);
        },1000)
      }

    });
  }
  userDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + this.data.bl_id + ' - ' + this.data.fl_id +" - "+ this.data.rmCode+ ' ?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteSiteRecord();
      },
      key: 'rmDetails'
    });
  }

  removeEmptyStringFields(value:any){
    let returnData:any ={
        blId: value.blId,
        flId: value.flId,
        rmId: value.rmId,
        rmCode: value.rmCode,
        rmName: value.rmName,
        rmInfo: value.rmInfo,
        rmCat: value.rmCat==''?null:value.rmCat,
        rmType: value.rmType==''?null:value.rmType,
        rmArea: value.rmArea,
        divId:value.divId==''?null:value.divId,
        depId:value.depId==''?null:value.depId,
        rmPhoto1: value.rmPhoto1,
        rmPhoto2: value.rmPhoto2,
        isReservable: value.isReservable,
        isHotelable : value.isHotelable,
        svgElementId: value.svgElementId,
        commonAreaType : value.commonAreaType,
        emCapacity:value.emCapacity,
        rmAreaManual: value.rmAreaManual,
        isOccupiable : value.isOccupiable
    }
    return returnData;
  }
}

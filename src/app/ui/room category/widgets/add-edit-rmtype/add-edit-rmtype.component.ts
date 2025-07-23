import { Component, OnInit, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { RmcatService } from '../../../../services/rmcat.service';
import { RmTypeList } from '../../model/rmtype-list.model';
import { RmTypeFilterInputDTO } from '../../model/DTO/rmTypeFilterInput.model';
import { UtilConstant } from '../../../../../common/UtilConstant';

declare var $: any;
@Component({
  selector: 'app-add-edit-rmtype',
  templateUrl: './add-edit-rmtype.component.html',
  styleUrls: ['./add-edit-rmtype.component.scss']
})
export class AddEditRmtypeComponent implements OnInit {

  frmRmTypeDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRmtypeComponent>,
    private service: RmcatService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) {
    this.frmRmTypeDetail = this.formBuilder.group({
      rmtypeFormPanel: []
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
  }
  loadData() {
    const calls = [];
    if (this.data.rmtype != null && this.data.rmcat != null) {
      calls.push(this.service.getRmTypeById(this.data.rmcat,this.data.rmtype));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        let data ={
          rmCat:'',
          rmType:'',
          rmTypeDesc:'',
          highlightColor:'#a6a6a6'
        }
        setTimeout(() => {
          this.frmRmTypeDetail.patchValue({
            rmtypeFormPanel: data
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.frmRmTypeDetail.patchValue({
            rmtypeFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    if (this.frmRmTypeDetail.valid) {
      const data: RmTypeList = this.frmRmTypeDetail.controls.rmtypeFormPanel.value;
      this.service.saveRmType(data).subscribe((res: any) => {
        if (res.status != 202) {
          this.toastr.success("Record saved Successfully.");
          this.dialogRef.close("saved");
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
        this.dialogRef.close(true);
      },
      key:'rmtypeForm'
    });
  }
  deleteRecord(){
    this.userDeleteConfirm();
  }
  deleteRmTypeRecord() {
    let data = new RmTypeFilterInputDTO(this.data.rmtype, "", this.frmRmTypeDetail.controls.rmtypeFormPanel.value.rmCat);
    this.service.deleteRoomType(data).subscribe((res) => {
      if (res != null ) {
        //  this.messageService.add({ key: 'siteDetailsMessage', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.dialogRef.close('deleted');
      }

    });
  }
  userDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + this.data.rmtype + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteRmTypeRecord();
      },
      key: 'rmtypeForm'
    });
  }
}

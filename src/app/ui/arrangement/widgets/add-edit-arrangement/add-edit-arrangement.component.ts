import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ArrangementService} from '../../services/arrangement.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { Arrangement } from '../../model/arrangement.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-arrangement',
  templateUrl: './add-edit-arrangement.component.html',
  styleUrls: ['./add-edit-arrangement.component.scss'],
  providers: [MessageService]

})
export class AddEditArrangementComponent implements OnInit {
  frmArrangementDetail: UntypedFormGroup;
  title: string = 'Add';
  checkTitle: boolean = false;
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private arrangeSrv : ArrangementService,
    private messageService: MessageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditArrangementComponent>,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
  ) {
    this.frmArrangementDetail = this.formBuilder.group({
      arrangementFormPanel: []
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
      this.isNew = this.data.newRecord
      if (!this.isNew) {
        this.title = 'Edit';
      }
    }
  }

  loadData() {
    let calls = [];
    if (this.data.arrangementId != null && this.data.arrangementId>0) {
      calls.push(this.arrangeSrv.getArrangementByType(this.data.arrangementType));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var arrangeData: Arrangement = {
          "arrangementId":0,
          "arrangementType": "",
          "description": "",
          "highlightColor":"#a6a6a6"
        };
        setTimeout(() => {
          this.frmArrangementDetail.patchValue({
            arrangementFormPanel: arrangeData,
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.frmArrangementDetail.patchValue({
            arrangementFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmArrangementDetail.valid) {
      const DataRecord: Arrangement = this.frmArrangementDetail.controls.arrangementFormPanel.value
      this.arrangeSrv.updateArrangement(DataRecord).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({ key: 'arrangeMessage', severity: 'success', summary: 'Arrangement saved', detail: 'The arrangement is saved successfully' });
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000);

        }else{
          this.messageService.add({ key: 'arrangeMessage', severity: 'error', summary: 'error', detail: res.text });
        }
      },
      );
    }
  }

  onCancel() {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close('cancel');
      }
    });
  }

}

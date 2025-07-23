import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { Parts } from '../../model/parts.model';
import { PartsService } from '../../services/parts.service';

@Component({
  selector: 'app-add-edit-parts',
  templateUrl: './add-edit-parts.component.html',
  styleUrls: ['./add-edit-parts.component.scss'],
  providers : [MessageService]
})
export class AddEditPartsComponent implements OnInit {

  frmPartsDetail!: UntypedFormGroup;
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
    public dialogRef: MatDialogRef<AddEditPartsComponent>,
    private partsService: PartsService,
    private confirmationService: ConfirmationService,
    private authServ: AuthService,
    private messageService: MessageService,
  ) {
    this.frmPartsDetail = this.formBuilder.group({
      partsFormPanel: []
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

  saveRecords() {
    if (this.frmPartsDetail.valid) {
      const data: any = this.frmPartsDetail.controls.partsFormPanel.value; //Parts
      this.partsService.saveParts(data).subscribe((res: any) => {
        if (res.partCode) {
          this.dialogRef.close(true);
        }else {
          this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
        }
      },
        error => {
        }
      );
    }
  }

  loadData() {
    const calls = [];
    if (this.data.partId != null) {
      calls.push(this.partsService.getByPartCode(this.data.partId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var partsData = {
          partId: 0,
          partCode: null,
          description: null,
          modelNo:null,
          qutMinHand:null,
          qutOnHand:null,
          consumable:this.data.isDefaultConsumable,
          qutOnOrder:null,
          unitOfMeasurement:null,
          ratePerUnit:null
        };
        setTimeout(() => {
          this.frmPartsDetail.patchValue({
            partsFormPanel: partsData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.frmPartsDetail.patchValue({
            partsFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  disableButton() {
    if (this.data.isEdit != null && !this.data.isEdit && !this.data.description) {
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

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: "parts"
    });
  }

}

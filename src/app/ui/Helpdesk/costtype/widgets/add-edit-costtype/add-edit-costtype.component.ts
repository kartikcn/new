import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, Subscription, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { CostType } from '../../model/costtype.model';
import { CostTypeService } from '../../services/costtype.service';

@Component({
  selector: 'app-add-edit-costtype',
  templateUrl: './add-edit-costtype.component.html',
  styleUrls: ['./add-edit-costtype.component.scss'],
  providers: [MessageService]
})
export class AddEditCosttypeComponent implements OnInit {

  frmCostTypeDetail!: UntypedFormGroup;
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
    public dialogRef: MatDialogRef<AddEditCosttypeComponent>,
    private costTypeService: CostTypeService,
    private confirmationService: ConfirmationService,
    private authServ: AuthService,
    private messageService: MessageService,
  ) {
    this.frmCostTypeDetail = this.formBuilder.group({
      costTypeFormPanel: []
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
    if (this.frmCostTypeDetail.valid) {
      const data: any = this.frmCostTypeDetail.controls.costTypeFormPanel.value; // CostType
      this.costTypeService.saveCostType(data).subscribe((res: any) => {
        if (res.costType) {
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
    if (this.data.costTypeId != null) {
      calls.push(this.costTypeService.getByCostType(this.data.costTypeId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var costTypeData = {
          costTypeId: 0,
          costType: null,
          description: null,
        };
        setTimeout(() => {
          this.frmCostTypeDetail.patchValue({
            CostTypeFormPanel: costTypeData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.frmCostTypeDetail.patchValue({
            costTypeFormPanel: results[0]
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
      key: "costType"
    });
  }
}

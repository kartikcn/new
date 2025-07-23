import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { RequestOtherCostService } from '../../services/request-other-cost-services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { forkJoin, of } from 'rxjs';
import { AddRequestOtherCostComponent } from '../add-request-other-cost/add-request-other-cost.component';

@Component({
  selector: 'app-add-edit-request-other-cost',
  templateUrl: './add-edit-request-other-cost.component.html',
  styleUrls: ['./add-edit-request-other-cost.component.scss']
})
export class AddEditRequestOtherCostComponent implements OnInit {
  frmRequestOtherCost!: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  isEdit: boolean = true;
  title: string = 'Add';
  isView: boolean = false;
  showActualCost : boolean = false
  @ViewChild(AddRequestOtherCostComponent, { static: false }) addRequestOtherCostComponent!: AddRequestOtherCostComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRequestOtherCostComponent>,
    private confirmationService: ConfirmationService,
    private requestOtherCostService: RequestOtherCostService
    
  ) {
    this.frmRequestOtherCost = this.formBuilder.group({
      requestOtherCostFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
      this.isNewRecord();
      if(this.data.showActualCost === true){
        this.showActualCost = true;
      }else{
        this.showActualCost = false;
      }
    }
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord;
      this.isView = this.data.isView;
      if (!this.isNew && !this.isView)
        this.title = 'Edit';
    } else if(this.isView) {
      this.title = '';
    }
  }

  loadData() {

    const calls = [];
    if (this.data.requestOtherCostId != null) {
      calls.push(this.requestOtherCostService.getById(this.data.requestOtherCostId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var reqOtherCostData = {
          requestOtherCostId: null,
          enteredBy: null,
          estimatedCost: null,
          actAmount: null,
          costType: null,
          requestId: this.data.requestId,
          dateEntered: null,
          timeEntered: null,
          description:null

        };
        setTimeout(() => {
          this.frmRequestOtherCost.patchValue({
            requestOtherCostFormPanel: reqOtherCostData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.addRequestOtherCostComponent.previousCostType = results[0].costTypeId;
          this.frmRequestOtherCost.patchValue({
            requestOtherCostFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmRequestOtherCost.valid) {
      const data = this.frmRequestOtherCost.controls.requestOtherCostFormPanel.value;

      this.requestOtherCostService.saveRequestCost(data).subscribe((res: any) => {
        if (res.requestId) {
          this.dialogRef.close(res);
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
    });
  }


}

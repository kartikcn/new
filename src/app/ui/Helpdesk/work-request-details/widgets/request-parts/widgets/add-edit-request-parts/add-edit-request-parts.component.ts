import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { AddRequestPartsComponent } from '../add-request-parts/add-request-parts.component';
import { RequestPartsService } from '../../services/request-parts.service';

@Component({
  selector: 'app-add-edit-request-parts',
  templateUrl: './add-edit-request-parts.component.html',
  styleUrls: ['./add-edit-request-parts.component.scss'],
  providers: [MessageService]
})
export class AddEditRequestPartsComponent implements OnInit {
  frmRequestParts!: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  isEdit: boolean = true;
  title: string = 'Add';
  previousPartQnty:any = 0;
  previousActualQnty:any = 0;
  isView:boolean = false;
  requestPartId:number = 0;
  @ViewChild(AddRequestPartsComponent, { static: false }) addRequestPartsComponent!: AddRequestPartsComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRequestPartsComponent>,
    private confirmationService: ConfirmationService,
    private requestPartService: RequestPartsService
  ) {
    this.frmRequestParts = this.formBuilder.group({
      requestPartsFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.isView = this.data.isView;
      this.loadData();
      this.isNewRecord();
    }
    if(this.isView) {
      this.title = "";
    }
  }

  setUserChecks(data:any) {
    this.addRequestPartsComponent.isRequestor = data.isRequestor;
    this.addRequestPartsComponent.isApprover = data.isApprover;
    this.addRequestPartsComponent.isSupervisor = data.isSupervisor;
    this.addRequestPartsComponent.isTechnician = data.isTechnician;
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
    if (this.data.requestPartId != null) {
      calls.push(this.requestPartService.getById(this.data.requestPartId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        
        var reqPartData = {
          partId: null,
          AvalQuantity: null,
          reqQuantity: null,
          requestPartId: null,
          requestId: this.data.requestId,
          dateAssigned: null,
          timeAssigned: null,
          actualQuantityUsed: null

        };
        setTimeout(() => {
          this.addRequestPartsComponent.requestId = this.data.requestId;
          this.frmRequestParts.patchValue({
            requestPartsFormPanel: reqPartData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.setUserChecks(this.data.userChecks);
          this.previousPartQnty = results[0].reqQuantity;
          this.addRequestPartsComponent.previousPartQnty  = results[0].reqQuantity;
          this.addRequestPartsComponent.previousPart = results[0].partId;
          this.previousActualQnty = results[0].actualQuantityUsed;
          this.requestPartId = results[0].requestPartId;
          this.frmRequestParts.patchValue({
            requestPartsFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmRequestParts.valid) {
      const data = this.frmRequestParts.controls.requestPartsFormPanel.value;
      data.requestId=this.data.requestId;
      data.reducePartQnty = data.reqQuantity - this.previousPartQnty;
      //data.reducueActualQnty = data.actualQuantityUsed - data.reqQuantity;
      this.requestPartService.saveRequestPart
        (data).subscribe((res: any) => {
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

  onDelete(){
    if(!this.isView && this.requestPartId != 0) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteRequestPart();
        },
      });
    }
  }

  deleteRequestPart() {
    let requestPartId = this.data.requestPartId;
    this.requestPartService.deleteById(requestPartId).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.dialogRef.close("not able to delete");
      } else {
        this.dialogRef.close("deleted");
      }
    },
      
    );
  }

}

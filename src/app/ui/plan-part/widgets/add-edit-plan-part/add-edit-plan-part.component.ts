import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, forkJoin, of } from 'rxjs';
import { PlanPartService } from '../../services/plan-part-services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-edit-plan-part',
  templateUrl: './add-edit-plan-part.component.html',
  styleUrls: ['./add-edit-plan-part.component.scss'],
  providers: [MessageService]
})
export class AddEditPlanPartComponent implements OnInit {

  formPlanPartDetail: FormGroup;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  opertation_title = "";
  // @ViewChild(AddPlanStepsFormComponent, { static: false }) addPlanStepsFormComponent!: AddPlanStepsFormComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditPlanPartComponent>,
    private confirmationService: ConfirmationService,
    private planPartService: PlanPartService,
    private messageService: MessageService,
  ) {
    this.formPlanPartDetail = this.formBuilder.group({
      planPartFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
      this.isNewRecord();
      this.opertation_title = this.isNew ? "Add" : "Edit";
    }
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord
    }
  }

  loadData() {
    const calls = [];
    if (this.data.planPartId != null) {
      calls.push(this.planPartService.getPlanPartById(this.data.planPartId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
       let planPartData = {
        planPartId:null,
        planStepId:this.data.planStepId,
        partId:null,
        qunatityRequired:null
       }
        setTimeout(() => {
          this.formPlanPartDetail.patchValue({
            planPartFormPanel: planPartData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.formPlanPartDetail.patchValue({
            planPartFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.formPlanPartDetail.valid) {
      const planPartData: any = this.formPlanPartDetail.controls.planPartFormPanel.value;
      this.planPartService.savePlanPart(planPartData).subscribe((res: any) => {
        if (res.code == 200) {
          this.dialogRef.close(true);
        } else {
          this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
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
      }
    });
  }
}

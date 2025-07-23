import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LinkPlanToLocationOrAssetService } from 'src/app/ui/link-plan-to-location/services/link-plan-to-location.services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-edit-location-plan',
  templateUrl: './edit-location-plan.component.html',
  styleUrls: ['./edit-location-plan.component.scss'],
  providers: [MessageService]
})
export class EditLocationPlanComponent {
  formLinkPlanLocation: FormGroup;
  isNew: boolean = true;
  title: string = 'Link';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditLocationPlanComponent>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authSrv: AuthService,
    private linkPlanToLocationOrAssetService: LinkPlanToLocationOrAssetService,

  ) {
    this.formLinkPlanLocation = this.formBuilder.group({
      linkPlanLocationFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
      this.isNewRecord();
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
    if (this.data.planLocEqData === null) {
      var rmData = {
        planLocEqId: 0,
        planId: this.data.planId,
        blId: this.data.bl_id,
        flId: this.data.fl_id,
        rmId: null,

      };
      setTimeout(() => {
        this.formLinkPlanLocation.patchValue({
          linkPlanLocationFormPanel: rmData,
        });
      }, 0);

    } else {
      setTimeout(() => {
        this.formLinkPlanLocation.patchValue({
          linkPlanLocationFormPanel: this.data.planLocEqData
        });
      }, 0);
    }
  };


  saveRecords() {
    if (this.formLinkPlanLocation.valid) {
      let planLocEqData = this.formLinkPlanLocation.controls.linkPlanLocationFormPanel.value;
      planLocEqData.compId = this.authSrv.getLoggedInUserCompId();
      if (this.data.planLocEqData && this.data.planLocEqData.blId == planLocEqData.blId
        && this.data.planLocEqData.flId == planLocEqData.flId
        && this.data.planLocEqData.rmId == planLocEqData.rmId
        && this.data.planLocEqData.compId == planLocEqData.compId) {
        this.dialogRef.close(true);
      } else {
        this.checkExist(planLocEqData);
      }
    }
  }

  checkExist(planLocEqData: any) {
    this.messageService.clear();
    this.linkPlanToLocationOrAssetService.checkExists(planLocEqData).subscribe((res: any) => {
      if (!res) {
        let selectedPlansList: any[] = [];
        selectedPlansList.push(planLocEqData);
        this.linkPlanToLocationOrAssetService.save(selectedPlansList).subscribe((res: any) => {
          if (res.code === 200) {
            this.dialogRef.close(true);
          }
        })
      } else {
        this.messageService.add({ key: 'isExists', severity: 'warn', summary: 'Plan Already Linked', detail: 'Plan already linked to the selected location' });
      }

    })
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: 'planListGrid'
    });
  }


}

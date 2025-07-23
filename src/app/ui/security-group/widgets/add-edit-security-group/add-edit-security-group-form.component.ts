import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, forkJoin } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { SgServices } from '../../services/securityGroup.service';
import { AddSecurityGroupFormComponent } from '../add-security-group/add-security-group-form.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-security-group-form',
  templateUrl: './add-edit-security-group-form.component.html',
  styleUrls: ['./add-edit-security-group-form.component.scss'],
  providers: [MessageService]
})
export class AddEditSecurityGroupFormComponent implements OnInit {
  frmSgDetail: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  isEdit: boolean = true;
  title: string = 'Add'
  @ViewChild(AddSecurityGroupFormComponent, { static: false }) addSgPanel!: AddSecurityGroupFormComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditSecurityGroupFormComponent>,
    private sgServices: SgServices,
    private confirmationService: ConfirmationService,
    private messageService:MessageService
  ) {
    this.frmSgDetail = this.formBuilder.group({
      sgFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
      this.isNewRecord();
    }
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord

      if (!this.isNew && this.data.isEdit) {
        this.title = 'Edit';
      }
    }
  }

  loadData() {
    const calls = [];
    if (this.data.securityGroupId != null && this.data.securityGroupId > 0) {
      calls.push(this.sgServices.getSgBySecurityGroupId(this.data.securityGroupId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var sgData = {
          groupName: null,
          description: null
        }
        setTimeout(() => {
          this.frmSgDetail.patchValue({
            sgFormPanel: sgData
          });
        }, 0);
      } else {
        this.addSgPanel.tempTitle = results[0].groupName;
        setTimeout(() => {
          this.frmSgDetail.patchValue({
            sgFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmSgDetail.valid) {
      const sgData = this.frmSgDetail.controls.sgFormPanel.value;
      this.sgServices.save(sgData).subscribe((res: any) => {
        if (res.code == 200) {
            this.dialogRef.close(true);
        } else {
          this.messageService.add({severity:'warn', summary:"Group Name must be unique"})
        }
      },error => {
        this.messageService.add({severity:'error', summary:"Something went wrong"})
      });
    }
  }

  confirmDialog() {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
      },
      key: "positionDialog"
    });
  }

}

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, Subscription, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { Craftsperson } from '../../model/craftsperson.model';
import { CraftspersonService } from '../../services/craftsperson.service';
import { AddCraftspersonFormComponent } from '../add-craftsperson-form/add-craftsperson-form.component';

@Component({
  selector: 'app-add-edit-craftsperson',
  templateUrl: './add-edit-craftsperson.component.html',
  styleUrls: ['./add-edit-craftsperson.component.scss'],
  providers: [MessageService]
})

export class AddEditCraftspersonComponent implements OnInit {
  frmCfDetail!: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  isView:boolean = false;
  title: string = 'Add';

  @ViewChild(AddCraftspersonFormComponent, { static: false }) addCraftspersonFormComponent!: AddCraftspersonFormComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditCraftspersonComponent>,
    private service: CraftspersonService,
    private confirmationService: ConfirmationService,
    private authServ: AuthService,
    private messageService: MessageService,
  ) {
    this.frmCfDetail = this.formBuilder.group({
      cfFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    this.isView = false;
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
      if (!this.isNew && this.isEdit){
        this.title = 'Edit';
      }else if (!this.isNew && !this.isEdit){
        this.title = 'View';
        this.isView= true;
      }
        
    }
  }

  loadData() {
    const calls = [];
    if (this.data.cfId != null) {
      calls.push(this.service.getCraftspersonById(this.data.cfId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var callData = {
          cfId: null,
          name: null,
          email: null,
          phone: null,
          status: null,
          skills: null,
          rateHourly: 0,
          rateDouble: 0,
          rateOver: 0,
          stdHoursAvail: 0,
          isSupervisor: this.data.isSupervisor,
          supplierId:null

        };
        setTimeout(() => {
          this.frmCfDetail.patchValue({
            cfFormPanel: callData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.addCraftspersonFormComponent.presentEmail = results[0].email;
          this.frmCfDetail.patchValue({
            cfFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmCfDetail.valid) {
      const data: any = this.frmCfDetail.controls.cfFormPanel.value; //CreaftsPerson
      this.service.saveCraftsperson(data).subscribe((res: any) => {
        if (res.cfId) {
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

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: "cf"
    });
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StateService } from '../../services/state.service';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-add-edit-state',
  templateUrl: './add-edit-state.component.html',
  styleUrls: ['./add-edit-state.component.css'],
  providers: [MessageService]
})
export class AddEditStateComponent implements OnInit {

  frmStateDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add'
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditStateComponent>,
    private stateSrv: StateService,
    private confirmationService: ConfirmationService,
    private messageService:MessageService
  ) {
    this.frmStateDetail = this.formBuilder.group({
      stateFormPanel: []
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
      if(!this.isNew){
        this.title = 'Edit';
      }
    }
  }
  loadData() {
    const calls = [];
    if (this.data.state_id != null) {
      calls.push(this.stateSrv.getStateById(this.data.state_id));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {

      } else {
        setTimeout(() => {
          this.frmStateDetail.patchValue({
            stateFormPanel: results[0].state
          });
        }, 0);
      }
    });
  }
  saveRecords() {
   
    this.messageService.clear();
    if (this.frmStateDetail.valid) {
      const stateData: any = this.frmStateDetail.controls.stateFormPanel.value; //replace any with StateList
      this.stateSrv.saveState(stateData).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({ key: 'save', severity: 'success', summary: res.text });
          setTimeout(() => {
            this.dialogRef.close();
          }, 1000);
        } else {
          this.messageService.add({ key: 'save', severity: 'error', summary: 'error', detail: res.text });
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
        this.dialogRef.close();
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      }
    });
  }

}

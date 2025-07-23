import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from '../../services/messages.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { Messages } from '../../model/messages.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-messages',
  templateUrl: './add-edit-messages.component.html',
  styleUrls: ['./add-edit-messages.component.scss'],
  providers: [MessageService]

})
export class AddEditMessagesComponent implements OnInit {
  frmMessageDetail: UntypedFormGroup;
  title: string = 'Add';
  processList: any[] = [];
  checkTitle: boolean = false;
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private msgService: MessagesService,
    private messageService: MessageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditMessagesComponent>,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
  ) {
    this.frmMessageDetail = this.formBuilder.group({
      messagesFormPanel: []
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
    if (this.data.msgId != null && this.data.msgId>0) {
      var dataObj = {
        processId: this.data.processId,
        msgId: this.data.msgId,
        msgText: "",
        msgCode:""
      }
      calls.push(this.msgService.getMsgsById(dataObj));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe((results:any) => {
      if (results[0] == null) {
        var msgData: Messages = {
          "processId": null,
          "msgId": 0,
          "msgText": "",
          "msgCode":""
        };
        setTimeout(() => {
          this.frmMessageDetail.patchValue({
            messagesFormPanel: msgData,
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.frmMessageDetail.patchValue({
            messagesFormPanel: results[0].messages
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmMessageDetail.valid) {
      const msgDataRecord: Messages = this.frmMessageDetail.controls.messagesFormPanel.value
      this.msgService.updateMessages(msgDataRecord).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({ key: 'msgMessage', severity: 'success', summary: 'Message saved', detail: 'The message is saved successfully' });
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000);
        }else{
          this.messageService.add({ key: 'msgMessage', severity: 'error', summary: 'error', detail: res.text });
        }
      }
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

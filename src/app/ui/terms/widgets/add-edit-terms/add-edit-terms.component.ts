import { Component, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AddEditMessagesComponent } from 'src/app/ui/messages/widgets/add-edit-messages/add-edit-messages.component';
import { UtilConstant } from 'src/common/UtilConstant';
import { TermsService } from '../../services/terms.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-terms',
  templateUrl: './add-edit-terms.component.html',
  styleUrls: ['./add-edit-terms.component.scss'],
  providers: [MessageService]
})
export class AddEditTermsComponent {
  frmTermDetail: UntypedFormGroup;
  title: string = 'Add';
  processList: any[] = [];
  checkTitle: boolean = false;
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private termservice : TermsService,
    private messageService: MessageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditMessagesComponent>,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
  ) {
    this.frmTermDetail = this.formBuilder.group({
      termFormPanel: []
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
    if (this.data.termId != 0 ) {
      let dataObj = {
        term: this.data.term,
        dateFrom: this.data.dateFrom,
        dateTo: this.data.dateTo,
        comments : this.data.comments
      }
      setTimeout(() => {
        this.frmTermDetail.patchValue({
          termFormPanel: dataObj
        });
      }, 0);
    }
    else {
      let dataObj= {
        term: "",
        dateFrom: null,
        dateTo: null,
        comments : null
      };
      setTimeout(() => {
        this.frmTermDetail.patchValue({
          termFormPanel: dataObj
        });
      }, 0);
    }
  }

  saveRecords() {
    if (this.frmTermDetail.valid) {
      const termDataRecord: any = {
        "termId":this.isNew?0:this.data.termId,
        "term":this.frmTermDetail.controls.termFormPanel.value.term.trim(),
        "dateFrom":this.datePipe.transform(this.frmTermDetail.controls.termFormPanel.value.dateFrom, "yyyy-MM-dd"),
        "dateTo":this.datePipe.transform(this.frmTermDetail.controls.termFormPanel.value.dateTo, "yyyy-MM-dd"),
        "comments":this.frmTermDetail.controls.termFormPanel.value.comments
      }
      this.termservice.saveTerm(termDataRecord).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({ key: 'termMessage', severity: 'success', summary: 'Term updated', detail: 'The term is saved successfully' });
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000);
        }else{
          this.messageService.add({ key: 'termMessage', severity: 'error', summary: 'error', detail: res.text });
        }
      });
    }
  }

  onCancel() {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
      }
    });
  }

}

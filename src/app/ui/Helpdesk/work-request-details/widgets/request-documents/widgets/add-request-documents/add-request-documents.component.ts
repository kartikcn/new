import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestDocumentsService } from '../../services/request-documents.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-request-documents',
  templateUrl: './add-request-documents.component.html',
  styleUrls: ['./add-request-documents.component.scss'],
  providers: [MessageService]
})
export class AddRequestDocumentsComponent implements OnInit {

  documentsForm: UntypedFormGroup;
  fileName: string = "No file chosen";
  errorMsg: string = '';
  selectedFile: any;
  fileSelected: boolean = false;
  subscriptions: Subscription[] = [];
  showWarning: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmationService: ConfirmationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddRequestDocumentsComponent>,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private requestDocumentService: RequestDocumentsService,
    private messageService: MessageService
  ) {
    this.documentsForm = this.formBuilder.group({
      requestDocId: 0,
      requestId: null,
      documentName: null,
      docType: null,
      documentContent: null,
      dateAdded: null,
      docDescription: null
    });
  }

  ngOnInit(): void {
    if (this.data !== null) {
      this.documentsForm.patchValue({
        requestId: parseInt(this.data.requestId)
      });
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

  fileChangeEvent(event: any) {
    var file = event.target.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxFileSize) {
      this.showWarning = true; // Show warning message for file size exceeding the limit
    } else {
      this.showWarning = false;
      this.fileSelected = true;
      let fileReader = new FileReader();
      this.selectedFile = file;
      this.fileName = this.selectedFile.name;
      fileReader.onload = (e) => {
        const content = fileReader.result as string;// Retrieve the file content from the result property
        const extension = this.getFileExtension(this.selectedFile.name); // Extract the file extension
        this.documentsForm.patchValue({
          documentName: this.selectedFile.name,
          docType: extension,
          documentContent: content,
        });
      };
      fileReader.readAsDataURL(file);
    }
  }

  getFileExtension(fileName: string): string {
    const regex = /(?:\.([^.]+))?$/;
    const result = regex.exec(fileName);
    if (result && result[1]) {
      return result[1];
    } else {
      return ''; // Return an empty string or handle the situation according to your requirements
    }
  }

  onSaveDocuments() {
    const data = this.documentsForm.value;
    const uploadData = new FormData();
    uploadData.set('document', this.selectedFile, data.documentName);
    uploadData.set("requestId", data.requestId);
    uploadData.set("requestDocId", data.requestDocId);
    uploadData.set("documemtType", data.docType);
    uploadData.set("documentName", data.documentName);
    uploadData.set("docDescription", data.docDescription);

    this.requestDocumentService.saveDocuments(uploadData).subscribe((res: any) => {
      if (res.status === 200) {
        this.dialogRef.close(res);
      }
    })
  }

  onClickOk() {
    this.showWarning = false;
    this.fileSelected = false;
  }

}

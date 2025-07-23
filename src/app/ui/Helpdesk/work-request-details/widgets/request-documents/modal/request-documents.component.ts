import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { RequestDocumentsProvider } from '../provider/request-documents.provider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RequestDocumentsService } from '../services/request-documents.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-documents',
  templateUrl: './request-documents.component.html',
  styleUrls: ['./request-documents.component.scss']
})
export class RequestDocumentsComponent implements OnInit {

  savedFiles: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  requestId: any = 0;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  displayImage: boolean = false;
  src: any;
  @Input() isReadOnly: boolean = false;

  constructor(
    private requestDocumentsProvider: RequestDocumentsProvider,
    private messageService: MessageService,
    private requestDocumentsService: RequestDocumentsService,
    private confirmSerive: ConfirmationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

  }

  onAddDocuments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      requestId: this.requestId,
      // isView: false,
      userChecks: { isRequestor: this.isRequestor, isApprover: this.isApprover, isSupervisor: this.isSupervisor, isTechnician: this.isTechnician }
    }
    this.requestDocumentsProvider.openDialog(dialogConfig);
    this.requestDocumentsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'requestDoc', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadDocumentsByRequest(this.requestId);
      }
    });
  }

  loadDocumentsByRequest(requestId: any) {
    this.requestDocumentsService.getDocumentsById(parseInt(requestId)).subscribe((res: any) => {
      if (res.length > 0) {
        this.savedFiles = res.map((each: any)=>{
          return{
            ...each,
            formatedDateAdded : this.datePipe.transform(each.dateAdded, 'd MMM yyyy')
          }
        });
      } else {
        this.savedFiles = [];
      }
    })
  }

  onDelete(id: any) {
    this.confirmSerive.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'deleteDoc',
      accept: () => {
        this.deleteDocument(id)
      },
    });
  }

  deleteDocument(id: any) {
    this.requestDocumentsService.deleteRequestDocument(id).subscribe((res: any) => {
      if (res.code === 200) {
        this.messageService.add({ key: 'requestDoc', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadDocumentsByRequest(this.requestId);
      }
    })
  }

  showDocumentDialog(doc: any) {
    if (doc.docType === 'png' || doc.docType === 'jpeg' || doc.docType === 'jpg') {
      this.src = "data:image/png;base64," + doc.documentContent;
      this.displayImage = true;
      return false;
    } else {
      const byteCharacters = atob(doc.documentContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      let mimeType: string;

      // Determine the MIME type based on the file extension or type
      if (doc.docType === 'pdf') {
        mimeType = 'application/pdf';
      } else if (doc.docType === 'doc' || doc.docType === 'docx') {
        mimeType = 'application/msword';
      } else if (doc.docType === 'xlsx' || doc.docType === 'xls') {
        mimeType = 'application/vnd.ms-excel';
      } else if (doc.docType === 'ppt') {
        mimeType = 'application/vnd.ms-powerpoint';
      } else {
        // Fallback to a generic binary file
        mimeType = 'application/octet-stream';
      }
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.setAttribute('download', doc.documentName); // Set the download attribute to the desired filename
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return false;
    }
  }

}


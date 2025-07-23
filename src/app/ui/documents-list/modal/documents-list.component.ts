import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DocumentsListModalDialogueProvider } from '../provider/document-list-provider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { AddDocumentsListModalDialogueProvider } from '../provider/add-documents-list-provider';
import { DocumentListService } from '../services/document-list-services';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss'],
  providers: [MessageService]
})
export class DocumentsListComponent implements OnInit {

  tableName: string = '';
  fieldName: string = '';
  rowCount: number = 3;
  docBucketItemsList: any[] = []
  docId: number = 0;
  src: any;
  displayImage: boolean = false;
  data: any;
  eqDocuments: any[] = [];
  planDocuments: any[] = [];
  cardTitles: any[] = [{ id: "Asset Documents" }, { id: "Plan Documents" }];
  showAccordion: boolean = false;
  cardData: any[] = []
  @Input() docBucketId: any = 0;
  @Output() parentFun = new EventEmitter();
  constructor(
    private messageService: MessageService,
    private confirmSerive: ConfirmationService,
    private documentListService: DocumentListService,
    private addDocumentsListModalDialogueProvider: AddDocumentsListModalDialogueProvider
  ) { }

  ngOnInit(): void {

  }


  onAddDocuments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      docBucketId: this.data.docBucketId,
      tableName: this.data.tableName,
      pkField: this.data.pkField,
      fieldName: this.data.fieldName,
      pkValue: this.data.pkValue
    }
    this.addDocumentsListModalDialogueProvider.openDialog(dialogConfig);
    this.addDocumentsListModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'requestDoc', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        if (this.data.tableName == "wr") {
          this.loadDocumentsByRequestIdAndDocBucketId(this.data.pkValue, result);
        } else {
          this.loadDocumentsByDocBucketId(result);
        }

        this.docId = result;
        this.docBucketId = result;
        this.data.docBucketId = result;
        this.setDocBucketId(result);
      }
    });
  }

  loadDocumentsByDocBucketId(docBucketId: any) {
    //get all docBucketItemsBydocBucketId
    this.docBucketItemsList = [];
    if (!(docBucketId == null || docBucketId == "null" || docBucketId == 0)) {
      this.documentListService.getListOfDocuments(docBucketId).subscribe((res: any) => {
        this.docBucketItemsList = res;
      })
    }

  }


  showDocumentDialog(doc: any) {

    this.documentListService.getDocument(doc.docBucketItemsId).subscribe((res: any) => {
      const docContent = res.text;
      if (doc.docExtension === 'png' || doc.docExtension === 'jpeg' || doc.docExtension === 'jpg') {
        this.src = "data:image/png;base64," + docContent;
        this.displayImage = true;
      } else {
        const byteCharacters = atob(docContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        let mimeType: string;


        // Determine the MIME type based on the file extension or type
        if (doc.docExtension === 'pdf') {
          mimeType = 'application/pdf';
        } else if (doc.docExtension === 'doc' || doc.docExtension === 'docx') {
          mimeType = 'application/msword';
        } else if (doc.docExtension === 'xlsx' || doc.docExtension === 'xls') {
          mimeType = 'application/vnd.ms-excel';
        } else if (doc.docExtension === 'ppt') {
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
        anchor.setAttribute('download', doc.docName); // Set the download attribute to the desired filename
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
    })



  }

  onDelete(docDetails: any) {
    this.confirmSerive.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocument(docDetails);
      },
      key: "deleteDoc"
    });
  }

  deleteDocument(docDetails: any) {
    this.documentListService.deleteDocument(docDetails).subscribe((res: any) => {
      this.messageService.clear();
      this.loadDocumentsByDocBucketId(docDetails.docBucketId)
      this.messageService.add({ key: 'requestDoc', severity: 'success', summary: 'Record Deleted successfully', detail: 'Record Deleted successfully' });
    })
  }

  setDocBucketId(result: any) {
    this.parentFun.emit(result);
  }

  loadDocumentsByRequestIdAndDocBucketId(requestId: any, docBucketId: any) {
    //get all docBucketItemsBydocBucketId
    this.rowCount = 5;
    this.docBucketItemsList = [];
    this.showAccordion = true;
    this.documentListService.getListOfDocumentsByRequestId(parseInt(requestId), docBucketId).subscribe((res: any) => {
      this.docBucketItemsList = res.wrDocs;
      this.eqDocuments = res.eqDocs;
      this.planDocuments = res.planDocs;
    })
  }


  onTabOpen(event: any) {

    this.cardData = [];
    var selectedTab = this.cardTitles[event.index];
    switch (selectedTab.id) {
      case 'Asset Documents':
        this.cardData = this.eqDocuments;
        break;
      case 'Plan Documents':
        this.cardData = this.planDocuments;
        break;
      default:
        this.cardData = [];
        break;
    }
  }
}

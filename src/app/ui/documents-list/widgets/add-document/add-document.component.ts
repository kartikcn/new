import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EquipmentService } from 'src/app/ui/Helpdesk/equipment/services/equipment.services';
import { UtilConstant } from 'src/common/UtilConstant';
import { DocumentListService } from '../../services/document-list-services';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss'],
  providers: [MessageService]
})
export class AddDocumentComponent implements OnInit {
  documentsForm: FormGroup;
  title: string = 'Add';
  fileName: string = "No file chosen";
  selectedFile: any;
  fileSelected: boolean = false;
  showWarning: boolean = false;
  upLoadData:any;
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumTabledata: Enums[] = [];
  enumDocType:Enums[]= [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmationService: ConfirmationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddDocumentComponent>,
    private formBuilder: FormBuilder,
    private documentListService: DocumentListService,
    private enumsrv: EnumService,
  ) {
    this.documentsForm = this.formBuilder.group({
      notes:[null],
      docType:[null,[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadEnums();
    if (this.data !== null) {
      this.documentsForm.patchValue({
        docType:this.data.tableName == "eq" ?'Asset Photo' : "Other"//Default in all cases
      })
    }
  }

  loadEnums() {
    this.enumList = [];
    this.enumDocType = [];
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumTabledata = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === this.data.tableName.toLocaleUpperCase());
        this.enumDocType = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === this.data.tableName.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'doc_type'.toLocaleUpperCase());
    
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
      this.selectedFile = file;
      this.fileName = this.selectedFile.name;

      let fileReader = new FileReader();
      fileReader.onload = (e:any) => {
        const content = fileReader.result as string;// Retrieve the file content from the result property
        const extension = this.getFileExtension(this.selectedFile.name); // Extract the file extension
        const upLoadData = new FormData();
        upLoadData.set('document', this.selectedFile, this.fileName);
        upLoadData.set("documemtType", extension);
        upLoadData.set("documentName", this.fileName);
        upLoadData.set("tableName", this.data.tableName);//need to be dynamic
        upLoadData.set("fieldName", this.data.fieldName);//need to dynamic
        upLoadData.set("pkField", this.data.pkField);//need to dynamic
        upLoadData.set("docBucketId", this.data.docBucketId || 0);//need to be dynamic
        upLoadData.set("pkValue",this.data.pkValue);
        this.upLoadData = upLoadData;
      }
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
    this.upLoadData.set("notes", this.documentsForm.controls.notes.value);
    this.upLoadData.set("docType", this.documentsForm.controls.docType.value);
    this.documentListService.saveDocuments(this.upLoadData).subscribe((res: any) => {
      if (res.status === 200) {
        console.log(res.body.text);//docBucketId
        this.dialogRef.close(res.body.text);

      }
    })
  };

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
      },
     
    });
  }

}


import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { EquipmentService } from '../../../services/equipment.services';
import { AddEqFormComponent } from '../../add-equipment/add-eq-form/add-eq-form.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DocumentsListComponent } from 'src/app/ui/documents-list/modal/documents-list.component';
import { EqStdDialogueProvider } from 'src/app/ui/Helpdesk/eq-std/providers/eq-std.provider';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-eq-form',
  templateUrl: './add-edit-eq-form.component.html',
  styleUrls: ['./add-edit-eq-form.component.scss'],
  providers: [MessageService]
})
export class AddEditEqFormComponent implements OnInit {
  frmEqDetail: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  index: number = 0;
  selectedTab: String = '';
  docBucketId:number = 0;
  eqId:number = 0;
  @ViewChild(AddEqFormComponent, { static: false }) addEqFormPanel!: AddEqFormComponent;
  @ViewChild(DocumentsListComponent, { static: false }) documentsListComponent!: DocumentsListComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditEqFormComponent>,
    private eqService: EquipmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private eqStdProvider: EqStdDialogueProvider,
    private datePipe: DatePipe
  ) {
    this.frmEqDetail = this.formBuilder.group({
      eqFormPanel: [],
      eqLocationPanel:[],
      eqInsurance:[],
      eqLease:[],
      eqWarranty:[]
    })
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
    if (this.data.eqId != null) {
      calls.push(this.eqService.getEquipmentById(this.data.eqId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        this.eqId = 0;
        var eqData = {
          eqId: 0,
          eqCode: null,
          eqStd: null,
          blId: null,
          flId: null,
          rmId: null,
          status: null,
          description: null,
          svgElementId: null,
          docBucketId: null
        }
        setTimeout(() => {
          this.frmEqDetail.patchValue({
            eqFormPanel: eqData,
            eqLocationPanel:eqData
          });
        }, 0);
      } else {
        this.eqId = results[0].eqId;
        this.addEqFormPanel.presentEquipment = results[0].eqId;
        this.docBucketId = results[0].docBucketId || 0;
        setTimeout(() => {
          this.frmEqDetail.patchValue({
            eqFormPanel: results[0],
            eqLocationPanel: results[0],
            eqInsurance: results[0],
            eqLease:  results[0],
            eqWarranty:results[0]

          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmEqDetail.valid) {
      const eqDetails = this.frmEqDetail.controls.eqFormPanel.value;
      const eqLocation = this.frmEqDetail.controls.eqLocationPanel.value;
      const eqInsurance = this.frmEqDetail.controls.eqInsurance.value;
      const eqLease = this.frmEqDetail.controls.eqLease.value;
      const eqWarranty = this.frmEqDetail.controls.eqWarranty.value;
      const eqData = {...eqDetails,...eqLocation,...eqInsurance,...eqLease,...eqWarranty}
      eqData.manfDate = eqData.manfDate ? this.datePipe.transform(eqData.manfDate, "yyyy-MM-dd"): null;
      eqData.dateInstalled = eqData.dateInstalled ? this.datePipe.transform(eqData.dateInstalled, "yyyy-MM-dd"): null;
      eqData.dateDisposed = eqData.dateDisposed ? this.datePipe.transform(eqData.dateDisposed, "yyyy-MM-dd"): null;
      eqData.dateSold = eqData.dateSold ? this.datePipe.transform(eqData.dateSold, "yyyy-MM-dd"): null;
      eqData.datePurchase = eqData.datePurchase ? this.datePipe.transform(eqData.datePurchase, "yyyy-MM-dd"): null;
      eqData.leaseFromDate = eqData.leaseFromDate ? this.datePipe.transform(eqData.leaseFromDate, "yyyy-MM-dd"): null;
      eqData.leaseToDate = eqData.leaseToDate ? this.datePipe.transform(eqData.leaseToDate, "yyyy-MM-dd"): null;
      eqData.insuranceFromDate = eqData.insuranceFromDate ? this.datePipe.transform(eqData.insuranceFromDate, "yyyy-MM-dd"): null;
      eqData.insuranceToDate = eqData.insuranceToDate ? this.datePipe.transform(eqData.insuranceToDate, "yyyy-MM-dd"): null;
      eqData.warrantyFromDate = eqData.warrantyFromDate ? this.datePipe.transform(eqData.warrantyFromDate, "yyyy-MM-dd"): null;
      eqData.warrantyToDate = eqData.warrantyToDate ? this.datePipe.transform(eqData.warrantyToDate, "yyyy-MM-dd"): null;
      eqData.docBucketId = this.docBucketId ? this.docBucketId : null
      this.messageService.clear();
      this.eqService.saveEquipment(eqData).subscribe((res: any) => {
        if (res.eqId) {
          this.eqId = res.eqId;
          this.addEqFormPanel.presentEquipment = res.eqId;
          // if(this.isNew) {
          //   this.confirmDoc();
          // } else {
          //   this.dialogRef.close(true);
          // }          
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
      key: "positionDialog"
    });
  }


  handleChange(event: any) {
    if (event != null) {
      this.index = event.index;
      this.selectedTab = event.originalEvent.target.innerText;
    }
    switch (this.selectedTab) {
      case "Details":
        this.data.eqId = this.eqId;
        this.loadData();
        break;
        case "Documents":
          this.documentsListComponent.data = {
            tableName:'eq',
            fieldName:'doc_bucket_id',
            pkField: 'eq_id',
            docBucketId:this.docBucketId,
            pkValue:this.addEqFormPanel.presentEquipment
          }
        this.documentsListComponent.loadDocumentsByDocBucketId(this.docBucketId);
        break;
    }
  }

  confirmDoc() {
    this.confirmationService.confirm({
      message: 'Asset saved successfully! Would you like to add "Documents"?',
      accept: () => {
        const event = {
          index: 1,
          originalEvent: { target: { innerText: 'Documents' } }
        }
        this.handleChange(event)
      },
      reject: (type: ConfirmEventType) => {

        this.dialogRef.close(true);
      },
      key: "confirmDialog"
    });
  }

}

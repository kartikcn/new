import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { ConnectorService } from '../../services/connector.services';
import { AddEditConnectorComponent } from '../add-edit-connector/add-edit-connector.component';

@Component({
  selector: 'app-add-edit-connector-flds',
  templateUrl: './add-edit-connector-flds.component.html',
  styleUrls: ['./add-edit-connector-flds.component.scss'],
  providers: [MessageService]
})
export class AddEditConnectorFldsComponent implements OnInit {
  connectorFldsDetails: FormGroup;
  title: string = 'Add';
  isNew: boolean = true;
  isEdit: boolean = false;
  value: any;
  confirmationResult: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditConnectorComponent>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private connectorService: ConnectorService

  ) {
    this.connectorFldsDetails = this.formBuilder.group({
      connectorFldsPanel: []
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
    if (this.data.connectorFldsId != null) {
      calls.push(this.connectorService.getConnectorFldsById(this.data.connectorFldsId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        let data = { 
          connectorId: this.data.connectorId,
          connectorFldsId: null,
          fieldName: null,
          fieldTitle: null,
          defaultValue: null,
          refTable: null,
        }

        setTimeout(() => {
          this.connectorFldsDetails.patchValue({
            connectorFldsPanel: data
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.connectorFldsDetails.patchValue({
            connectorFldsPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.connectorFldsDetails.valid) {
      const data = this.connectorFldsDetails.controls.connectorFldsPanel.value;
      this.connectorService.saveConnectorFlds(data).subscribe((res: any) => {
        this.messageService.clear();
        if (res.connectorFldsId) {
          this.dialogRef.close(res);
        } else {
          this.messageService.add({ key: 'error', severity: 'error', detail: res.text });
        }

      })

    }

  }

  confirmDialog(): void {
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

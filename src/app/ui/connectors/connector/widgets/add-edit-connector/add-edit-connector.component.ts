import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { ConnectorService } from '../../services/connector.services';

@Component({
  selector: 'app-add-edit-connector',
  templateUrl: './add-edit-connector.component.html',
  styleUrls: ['./add-edit-connector.component.scss'],
  providers: [MessageService]
})
export class AddEditConnectorComponent implements OnInit {
  connectorDetail: FormGroup;
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
    this.connectorDetail = this.formBuilder.group({
      connectorFormPanel: []
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
    if (this.data.connectorId != null) {
      calls.push(this.connectorService.getConnectorById(this.data.connectorId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        let data = {
          connectorId: null,
          connectorName: null,
          tableName: null,
          connectorType: null,
          fileFormat: null,
          seperator: "None",
          rowsToSkip: null,
          connectionPath: null,
          preProcess: null,
          postProcess: null
        }
        setTimeout(() => {
          this.connectorDetail.patchValue({
            connectorFormPanel: data
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.connectorDetail.patchValue({
            connectorFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.connectorDetail.valid) {
      const data = this.connectorDetail.controls.connectorFormPanel.value;
      data.seperator = data.seperator == null ? "None" : data.seperator;
      this.connectorService.saveConnector(data).subscribe((res: any) => {
        this.messageService.clear();
        if (res.connectorId) {
          this.dialogRef.close(true);
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

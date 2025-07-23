import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { Trade } from '../../model/trade.model';
import { TradesService } from '../../services/trades.services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-trades-form',
  templateUrl: './add-edit-trades-form.component.html',
  styleUrls: ['./add-edit-trades-form.component.scss'],
  providers: [MessageService]
})
export class AddEditTradesFormComponent implements OnInit {
  frmTradeDetail!: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditTradesFormComponent>,
    private service: TradesService,
    private confirmationService: ConfirmationService,
    private authServ: AuthService,
    private messageService: MessageService,
  ) {

    this.frmTradeDetail = this.formBuilder.group({
      tradeFormPanel: []
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

  loadData() {
    const calls = [];
    if (this.data.tradeId != null) {
      calls.push(this.service.getTradeById(this.data.tradeId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var tradeData = {
          tradeId: 0,
          tradeCode: null,
          rateHourly: 0,
          rateDouble: 0,
          rateOver: 0,
          stdHoursAvail: 0,
          description: null,
        };
        setTimeout(() => {
          this.frmTradeDetail.patchValue({
            tradeFormPanel: tradeData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.frmTradeDetail.patchValue({
            tradeFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmTradeDetail.valid) {
      const data: any = this.frmTradeDetail.controls.tradeFormPanel.value;///Trade
      this.service.saveTrade(data).subscribe((res: any) => {
        if (res.tradeId) {
          this.dialogRef.close(res.tradeId);
        }else {
          this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
        }
      },
        error => {
        }
      );
    }
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord;
      if (!this.isNew)
        this.title = 'Edit';
    }
  }

  disableButton() {
    if (this.data.isEdit != null && !this.data.isEdit && !this.data.description) {
      this.isEdit = false;
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
      key: "td"
    });
  }
}

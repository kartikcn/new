import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HolidayService } from '../../services/holiday.service';
import { AuthService } from '../../../../services/auth.service';
import { Holidays } from '../../model/holiday.model';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-holiday',
  templateUrl: './add-edit-holiday.component.html',
  styleUrls: ['./add-edit-holiday.component.scss'],
  providers: [MessageService]
})
export class AddEditHolidayComponent implements OnInit {

  frmHolidayDetail: UntypedFormGroup;
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
    public dialogRef: MatDialogRef<AddEditHolidayComponent>,
    private service: HolidayService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.frmHolidayDetail = this.formBuilder.group({
      holidayFormPanel: []
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
      this.isNew = this.data.newRecord;
      if (!this.isNew)
        this.title = 'Edit';
    }
  }
  loadData() {
    const calls = [];
    if (this.data.holidaysId > 0) {
      calls.push(this.service.getHolidaysById(this.data.holidaysId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var holidayData = {
          holidayDate: null,
          holidaysId: 0,
          holidayDesc: null,
        };
        setTimeout(() => {
          this.frmHolidayDetail.patchValue({
            holidayFormPanel: holidayData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.frmHolidayDetail.patchValue({
            holidayFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    
    if (this.frmHolidayDetail.valid) {
      const data: Holidays = this.frmHolidayDetail.controls.holidayFormPanel.value;
      data.holidayDate = new Date(data.holidayDate);
      this.service.saveHoliday(data).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({ key: 'holidayMessage', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
          setTimeout(() => {
            this.dialogRef.close();
          }, 1000);
        } else {
          this.messageService.add({ key: 'holidayMessage', severity: 'error', summary: res.text});
        }
      },
        error => {
          this.messageService.add({ key: 'holidayMessage', severity: 'error', summary: 'Something went wrong' });
        }
      );
    }

  }

  setDate(date: any) {
    var val = new Date(date);
    var userTimezoneOffset = val.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
      },
      key: "holiday"
    });
  }

  onDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ' + this.data.holidaysId + '?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteHoliday(this.data.holidaysId);
      },
      key: "holidayGrid"
    });
  }

  deleteHoliday(id: any) {
    this.service.deleteById(id).subscribe((res: any) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'holidayMessage', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      } else {
        this.messageService.add({ key: 'holidayMessage', severity: 'error', detail: res.text });
      }
    },
      error => {
      }
    );
  }

}

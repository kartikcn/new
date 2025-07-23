import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CountryService } from '../../../../services/country.service';
import { CountryOutputDto } from '../../model/DTO/countryOutputDto';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-add-edit-cntry',
  templateUrl: './add-edit-cntry.component.html',
  styleUrls: ['./add-edit-cntry.component.css'],
  providers: [MessageService]
})
export class AddEditCntryComponent implements OnInit {

  frmCntryDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add'
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditCntryComponent>,
    private cntrySrv: CountryService,
    private confirmationService: ConfirmationService,
    private messageService:MessageService
  ) {
    this.frmCntryDetail = this.formBuilder.group({
      cntryFormPanel: []
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
    const calls = [];
    if (this.data.cntry_id != null ) {
      calls.push(this.cntrySrv.getCntryById(this.data.cntry_id));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {

      } else {
        setTimeout(() => {
          this.frmCntryDetail.patchValue({
            cntryFormPanel: results[0].ctry
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    // this.dialogRef.close();
    if (this.frmCntryDetail.valid) {
      const cntryData: CountryOutputDto = {
        ctry: this.frmCntryDetail.controls.cntryFormPanel.value
      }
      this.cntrySrv.saveCntry(cntryData).subscribe((res: any) => {
        this.messageService.clear();
        if (res.code == 200) {
          this.messageService.add({ key: 'save', severity: 'success', summary: res.text });
          setTimeout(() => {
            this.dialogRef.close();
          }, 1000);
        } else {
         this.messageService.add({ key: 'save', severity: 'error', summary: 'error', detail: res.text });
        }
      }
      );
      //this.cntrySrv.saveCntry(cntryData);
    }

  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      }
    });
  }

}

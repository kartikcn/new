import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CityService } from '../../services/city.service';
import { UtilConstant } from '../../../../../common/UtilConstant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-add-edit-city',
  templateUrl: './add-edit-city.component.html',
  styleUrls: ['./add-edit-city.component.css'],
  providers: [MessageService]
})
export class AddEditCityComponent implements OnInit {

  frmCityDetail: UntypedFormGroup;
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
    public dialogRef: MatDialogRef<AddEditCityComponent>,
    private citySrv: CityService,
    private confirmationService: ConfirmationService,
    private messageService:MessageService
  ) {
    this.frmCityDetail = this.formBuilder.group({
      cityFormPanel: []
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
      if(!this.isNew){
        this.title = 'Edit';
      }
    }
  }
  loadData() {
    const calls = [];
    if (this.data.city_id != null) {
      calls.push(this.citySrv.getCityById(this.data.city_id));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {

      } else {
        setTimeout(() => {
          this.frmCityDetail.patchValue({
            cityFormPanel: results[0].city
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    this.messageService.clear();
    if (this.frmCityDetail.valid) {
      const cityData: any = this.frmCityDetail.controls.cityFormPanel.value;//CityList
      this.citySrv.saveCity(cityData).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({ key: 'save', severity: 'success', summary: res.text });
          setTimeout(() => {
            this.dialogRef.close();
          }, 1000);
        }else {
          this.messageService.add({ key: 'save', severity: 'error', summary: 'error', detail: res.text });
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
        this.dialogRef.close();
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      }
    });
  }

}

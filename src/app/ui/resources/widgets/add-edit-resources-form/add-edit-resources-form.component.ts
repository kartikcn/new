import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { ResourcesService } from '../../service/resources.service';
import { AddResourcesFormComponent } from '../add-resources-form/add-resources-form.component';

@Component({
  selector: 'app-add-edit-resources-form',
  templateUrl: './add-edit-resources-form.component.html',
  styleUrls: ['./add-edit-resources-form.component.scss'],
  providers: [MessageService]
})
export class AddEditResourcesFormComponent implements OnInit {
  frmResourcesDetail: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  isView: boolean = false;
  title: string = 'Add'

  @ViewChild(AddResourcesFormComponent, { static: false }) addResourcePanel!: AddResourcesFormComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditResourcesFormComponent>,
    private srv: ResourcesService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private authSrv:AuthService,
    private messageService: MessageService,
  ) { 
    this.frmResourcesDetail = this.formBuilder.group({
      resourcesFormPanel: []
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

      if (!this.isNew && this.data.isEdit ) {
        this.title = 'Edit';
        this.isView = false
      }
      if(!this.isNew && this.data.isView){
        this.title = 'View';
        this.isView = true;
      }
    }
  }
  loadData() {
    const calls = [];
    if (this.data.resourcesId != null && this.data.resourcesId>0) {
     calls.push(this.srv.getResourceById(this.data.resourcesId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
          var resourcesData = {
            resourcesId: 0,
            title: null,
            description:null,
            type: '',
            quanity: null,
            costPerUnit: null,
            dateCreated: null,
            timeCreated: null,
            dateLastUpdated: null,
            isReusable:''
          }
          setTimeout(() => {
            this.frmResourcesDetail.patchValue({
              resourcesFormPanel: resourcesData
            });
          }, 0);
      } else {
        this.addResourcePanel.tempTitle = results[0].title;
        setTimeout(() => {
          this.frmResourcesDetail.patchValue({
            resourcesFormPanel: results[0]
            
          });
        }, 0);
      }
    });
  }
  
  saveRecords() {
    this.messageService.clear();
    if (this.frmResourcesDetail.valid) {
      const resourcesData = this.frmResourcesDetail.controls.resourcesFormPanel.value;
      resourcesData.dateCreated = this.datePipe.transform(resourcesData.dateCreated, "yyyy-MM-dd");
      resourcesData.dateLastUpdated = resourcesData.dateLastUpdated != null? this.datePipe.transform(resourcesData.dateLastUpdated, "yyyy-MM-dd"):null;
      var costPerUnitStr:any = resourcesData.costPerUnit;
      var defCostPerUnit =  this.deformatValue(costPerUnitStr.slice(1,));
      resourcesData.costPerUnit = defCostPerUnit;
     this.srv.saveResource(resourcesData).subscribe((res: any) => {
        if (res.title != null) {
          this.dialogRef.close(res.title);
        }else if(res.code !=200){
          // this.dialogRef.close(res);
          this.messageService.add({ key: 'resources', severity: 'error', summary: 'error', detail:res.text });
        }
      });
    }
  }

  deformatValue(value:any) {
    // return value.replace(/[\n\£\,]+/g, '');
    return value.replace(/£/g, '').replaceAll(',','');
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
      }
    });
  }
}

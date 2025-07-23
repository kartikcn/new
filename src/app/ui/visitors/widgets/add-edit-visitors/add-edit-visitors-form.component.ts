import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { VisitorsService } from '../../services/visitors.service';
import { AddVisitorsFomComponent } from '../add-visitors/add-visitors-fom.component';


@Component({
  selector: 'app-add-edit-visitors-form',
  templateUrl: './add-edit-visitors-form.component.html',
  styleUrls: ['./add-edit-visitors-form.component.scss'],
  providers: [MessageService]
})
export class AddEditVisitorsFormComponent implements OnInit {
  frmVisitorsDetail: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  isView: boolean = false;
  title: string = 'Add'

  @ViewChild(AddVisitorsFomComponent, { static: false }) addvisitorPanel!: AddVisitorsFomComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditVisitorsFormComponent>,
    private srv: VisitorsService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    public userSrv: UsersService,
    private authSrv: AuthService,
    private messageService: MessageService,
  ) {
    this.frmVisitorsDetail = this.formBuilder.group({
      visitorsFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.isNewRecord();
      this.loadData();
      this.disableButton();

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

      if (!this.isNew && this.data.isEdit) {
        this.title = 'Edit';
        this.isView = false
      }
      if (!this.isNew && this.data.isView) {
        this.title = 'View';
        this.isView = true;
      }
    }
  }
  loadData() {
    const calls = [];
    if (this.data.visitorsId != null) {
      calls.push(this.srv.getVisitorById(this.data.visitorsId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var visitorsData = {
          visitorsId: 0,
          firstName: '',
          lastName: '',
          email: '',
          createdBy: null,
          phoneNum: '',
          blId: null,
          flId: null,
          comments: '',
          dateStart: null,
          dateEnd: null,
        }
        setTimeout(() => {
          this.frmVisitorsDetail.patchValue({
            visitorsFormPanel: visitorsData
          });
        }, 0);
      } else {
        setTimeout(() => {
          if (results[0].picture != null && results[0].picture != 0) {
            this.addvisitorPanel.visitor_img = "data:image/png;base64," + results[0].picture;
            
          }
          if(results[0].visitor.email.length > 0){
            this.addvisitorPanel.tempEmail = results[0].visitor.email;
          }
          this.frmVisitorsDetail.patchValue({
            visitorsFormPanel: results[0].visitor,
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    if (this.frmVisitorsDetail.valid) {
      const visitorsData = this.frmVisitorsDetail.controls.visitorsFormPanel.value;
      visitorsData.dateStart = visitorsData.dateStart != null ? this.datePipe.transform(visitorsData.dateStart, "yyyy-MM-dd") : null;
      visitorsData.dateEnd = visitorsData.dateEnd != null ? this.datePipe.transform(visitorsData.dateEnd, "yyyy-MM-dd") : null;
      this.srv.saveVisitor(visitorsData).subscribe((res: any) => {
        if (this.addvisitorPanel.isPhotoUploaded) {
          this.uploadBlPhoto(visitorsData.visitorsId);
        }
        if (res.visitorsId != null) {
          this.dialogRef.close(res.visitorsId);
        }
        if(res.code == 409) {
          this.messageService.add({ key: 'error', severity: 'error',  summary: res.text });
        }
      }
      );

    }

  }
  uploadBlPhoto(id: any) {
    const uploadData = new FormData();
    uploadData.set('imageFile', this.addvisitorPanel.selectedFile, this.addvisitorPanel.selectedFile.name);
    uploadData.set("tableName", 'visitors');
    uploadData.set("fieldName", 'picture');
    uploadData.set("pkeyValue", id);
    uploadData.set("imageName", this.addvisitorPanel.selectedFile.name);
    this.userSrv.uploadProfilePhto(uploadData).subscribe((res) => {
      
    });
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

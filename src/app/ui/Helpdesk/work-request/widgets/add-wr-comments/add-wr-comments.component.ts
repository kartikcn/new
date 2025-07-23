import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { WrCommentsServices } from '../../service/work-request-comments.services';
import { AuthService } from 'src/app/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-wr-comments',
  templateUrl: './add-wr-comments.component.html',
  styleUrls: ['./add-wr-comments.component.scss']
})
export class AddWrCommentsComponent implements OnInit {
  wrCommentsFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  commentData:any;
  title:string = 'Add';
  isView:boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddWrCommentsComponent>,
    private confirmationService: ConfirmationService,
    private formBuilder: UntypedFormBuilder,
    private wrCommentsService: WrCommentsServices,
    private authSrv: AuthService,
  ) {
    this.wrCommentsFormPanel = this.formBuilder.group({
      comments: [null],
      wrId:[null]
    })
    this.subscriptions.push(
      this.wrCommentsFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.title = this.data.isEdit ? "Edit" :this.data.isView ? "" : "Add";
    this.isView = this.data.isView;
    if (this.data.commentId != null) {
      this.wrCommentsService.getWrCommentsById(this.data.commentId).subscribe((res: any) => {
        this.commentData = res;
        setTimeout(() => {
          this.wrCommentsFormPanel.patchValue({
            comments: res.comments,
            wrId: res.wrId
          });
        });
      })
    } else {
      setTimeout(() => {
        this.wrCommentsFormPanel.patchValue({
          comments: null,
          wrId: this.data.wrId
        });
      });
    }
    if(this.isView) {
      this.wrCommentsFormPanel.disable();
    }
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const wrCommentsData: any = {
      comments: this.wrCommentsFormPanel.controls.comments.value,
      wrId: this.wrCommentsFormPanel.controls.wrId.value,
    };
    return wrCommentsData;
  }

  set value(value: any) {
    setTimeout(() => {
      this.wrCommentsFormPanel.patchValue({
        comments: value.comments,
        wrId:value.wrId
      });
    });
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.wrCommentsFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };

  validate(_: UntypedFormControl) {
    return this.wrCommentsFormPanel.valid ? null : { wrCommentsFormPanel: { valid: false } };
  }

  onCancel() {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: "wr-comments-cancel"
    });
  }

  onSave() {
    if (this.wrCommentsFormPanel.value.comments != '' && this.wrCommentsFormPanel.value.comments != null) {
      let wrCommentsData;
      if (this.data.isEdit) {
        wrCommentsData = {
          commentId: this.commentData.commentId,
          emId: this.commentData.emId,
          commentDate: this.commentData.commentDate,
          commentTime: this.commentData.commentTime,
          comments: this.wrCommentsFormPanel.controls.comments.value,
          compId: this.authSrv.getLoggedInUserCompId(),
          wrId: this.wrCommentsFormPanel.controls.wrId.value,
        }
      } else {
        wrCommentsData = {
          commentId: 0,
          emId: this.authSrv.getLoggedInUserEMId(),
          commentDate: null,
          commentTime: null,
          comments: this.wrCommentsFormPanel.controls.comments.value,
          compId: this.authSrv.getLoggedInUserCompId(),
          wrId: this.wrCommentsFormPanel.controls.wrId.value,
        }
      }

      this.wrCommentsService.saveWrComments(wrCommentsData).subscribe((res: any) => {
        if (res.commentId) {
          this.dialogRef.close(res);
        }
      })
    }
  }
}



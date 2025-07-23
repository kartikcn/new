import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { AddWrProblemTypeComponent } from '../add-wr-problem-type/add-wr-problem-type.component';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-wr-problem-type',
  templateUrl: './add-edit-wr-problem-type.component.html',
  styleUrls: ['./add-edit-wr-problem-type.component.scss']
})
export class AddEditWrProblemTypeComponent implements OnInit {

  subscriptions: Subscription[] = [];
  isDisabled: boolean = true;
  @ViewChild(AddWrProblemTypeComponent) addWrProbleType!: AddWrProblemTypeComponent;

  constructor(
    public dialogRef: MatDialogRef<AddEditWrProblemTypeComponent>,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
  }

  disabledFun(event: any) {
    if (event.data) {
      this.isDisabled = false
    } else {
      this.isDisabled = true;
    }
  }

  onSavePbType() {
    this.dialogRef.close(this.addWrProbleType.selectedRecord)
  }

  onCancelPbType() {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: "add-pb-type-cancel"
    });
  }

}
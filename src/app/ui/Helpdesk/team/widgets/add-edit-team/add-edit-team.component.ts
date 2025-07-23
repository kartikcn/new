import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { TeamService } from '../../services/team.service';
import { AddTeamComponent } from '../add-team/add-team.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-team',
  templateUrl: './add-edit-team.component.html',
  styleUrls: ['./add-edit-team.component.scss'],
  providers: [MessageService]
})
export class AddEditTeamComponent implements OnInit {
  frmTeamDetail: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  showType:boolean = true;

  @ViewChild(AddTeamComponent, { static: false }) addTeamFormPanel!: AddTeamComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditTeamComponent>,
    private teamService: TeamService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { 
    this.frmTeamDetail = this.formBuilder.group({
      teamFormPanel: []
    })
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    this.showType = this.data.showType;
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
    if (this.data.id != null) {
      calls.push(this.teamService.getTeamById(this.data.id));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        let data = {
          teamId: 0,
          teamCode:'',
          teamType:!this.showType? this.data.enumEmployeeType:null,
          description: '',
          highlightColor:'#a6a6a6',
        }
        setTimeout(() => {
          this.frmTeamDetail.patchValue({
            teamFormPanel: data
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.frmTeamDetail.patchValue({
            teamFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    this.messageService.clear();
    if (this.frmTeamDetail.valid) {
      const eqStdData = this.frmTeamDetail.controls.teamFormPanel.value;
      this.teamService.saveTeam(eqStdData).subscribe((res: any) => {
        if (res.teamCode) {
          this.dialogRef.close(true);
        }else if (res.code !=200){
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
      },
      key: "positionDialog"
    });
  }

}

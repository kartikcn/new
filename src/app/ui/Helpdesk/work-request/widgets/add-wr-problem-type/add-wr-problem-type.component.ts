import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProblemTypeService } from '../../../problem-type/services/problem-type..service';

@Component({
  selector: 'app-add-wr-problem-type',
  templateUrl: './add-wr-problem-type.component.html',
  styleUrls: ['./add-wr-problem-type.component.scss']
})
export class AddWrProblemTypeComponent implements OnInit {

  nodes!: TreeNode[];
  hideForm: boolean = true;
  selectedRecord: any[] = [];
  parentRecord!: any;
  compId!: number;
  loading: boolean = false;
  selectedFiles!: TreeNode[];
  probTypeFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  openedNodeData!: any;
  parentProbType: String = '';
  newRecord: boolean = true;
  title: string = '';

  @Output() saveBtnDisable = new EventEmitter();
  constructor(
    private authSrv: AuthService,
    private problemTypeSrv: ProblemTypeService,
  ) { }

  ngOnInit(): void {
    if (this.nodes && this.nodes.length > 0) {
      this.selectedFiles = [this.nodes[0]];
    }
    this.compId = this.authSrv.getLoggedInUserCompId();
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    this.nodes = [];
    this.problemTypeSrv.getAll().subscribe((res: any) => {
      this.nodes = res;
      this.loading = false;
    })
  }

  nodeSelect(event: any) {
    this.selectedRecord = event.node;
    this.saveBtnDisable.emit(this.selectedRecord);
  }
}

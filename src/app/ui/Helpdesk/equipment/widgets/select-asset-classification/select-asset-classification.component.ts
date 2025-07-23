import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { AssetClassificationService } from 'src/app/ui/Asset-Management/asset-classification/services/asset-classification-services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-select-asset-classification',
  templateUrl: './select-asset-classification.component.html',
  styleUrls: ['./select-asset-classification.component.scss']
})
export class SelectAssetClassificationComponent {
  nodes!: TreeNode[];
  selectedFiles!: TreeNode[];
  isNew: boolean = true;
  selectedRecord!: any;
  selectedNode!: any;
  treeState: any = {};
  isDisabled:boolean = true;
  constructor(
    public dialogRef: MatDialogRef<SelectAssetClassificationComponent>,
    private confirmationService: ConfirmationService,
    private assetClassificationSrv: AssetClassificationService,

  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.nodes = [];
    this.assetClassificationSrv.getAll().subscribe((res: any) => {
      this.nodes = res;
    })
  }

  nodeSelect(event: any) {
    this.selectedRecord = event.node;
    this.isDisabled = false;
  }

  onSave() {
    this.dialogRef.close(this.selectedRecord);
  }

  onCancel() {
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

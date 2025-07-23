import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ProblemTypeService } from '../services/problem-type..service';
import { AddProblemTypeComponent } from '../widgets/add-problem-type/add-problem-type.component';


@Component({
  selector: 'app-problem-type',
  templateUrl: './problem-type.component.html',
  styleUrls: ['./problem-type.component.scss'],
  providers: [MessageService]
})
export class ProblemTypeComponent implements OnInit {
  nodes!: TreeNode[];
  selectedFiles!: TreeNode[];
  isNew: boolean = true;
  hideForm: boolean = true
  selectedRecord!: any;
  parentRecord!: any;
  loading: boolean = false;
  parentProblemType: string = '';
  selectedNode!: any;
  expandedNodes: any[] = [];
  treeState: any = {};

  @ViewChild(AddProblemTypeComponent) addProblemTypePanel!: AddProblemTypeComponent;
  constructor(
    private problemTypeSrv: ProblemTypeService,
    private authSrv: AuthService,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    const expandedNodes = this.getExpandedNodes();
    this.loading = true;
    this.nodes = [];
    this.problemTypeSrv.getAll().subscribe((res: any) => {
      this.nodes = res;
      this.loading = false;
      expandedNodes.length > 0 ? this.restoreExpandedNodes(expandedNodes) : '';
    })

  }

  onAdd() {
    const data = {
      probTypeId: null,
      probType: null,
      description: null,
      hierarchyId: this.selectedRecord ? this.selectedRecord.hierarchyId + 1 : null,
      parentId: this.parentRecord ? this.parentRecord.key : null,
    }
    let parentLabels = [];
    if (this.selectedNode) {
      let node = this.selectedNode;
      while (node.parent) {
        parentLabels.unshift(node.parent.label);
        node = node.parent;
      }
      const selectedNodeLabels = parentLabels.length > 0 ? parentLabels.join(" | ") + " | " + this.selectedNode.label : this.selectedNode.label;
      if (selectedNodeLabels.length > 0) {
        this.addProblemTypePanel.parentProbType = selectedNodeLabels;
      } else {
        this.addProblemTypePanel.parentProbType = '';
      }
    }

    this.addProblemTypePanel.setFormData(data, "Add", this.parentProblemType);
    this.hideForm = false;
  }

  nodeSelect(event: any) {
    this.treeState.selectedNode = event.node;
    this.hideForm = true;
    let parentLabels = [];
    let node = event.node;
    while (node.parent) {
      parentLabels.unshift(node.parent.label);
      node = node.parent;
    }
    const selectedNodeLabels = parentLabels.join(" | ");
    if (selectedNodeLabels.length > 0) {
      this.addProblemTypePanel.parentProbType = selectedNodeLabels;
    } else {
      this.addProblemTypePanel.parentProbType = '';
    }
    this.selectedRecord = event.node.data;
    this.parentRecord = event.node.parent;
    this.addProblemTypePanel.selectedRecord = event.node.data;
    this.addProblemTypePanel.setFormData(event.node.data, "Edit", this.parentProblemType);
    this.hideForm = false;
    this.selectedNode = event.node;
  }

  onNodeExpand(event: any) {
    if (!this.treeState.expandedNodes) {
      this.treeState.expandedNodes = [];
    }
    this.treeState.expandedNodes.push(event.node);
  }

  refresh(action: any) {
    if (action === 'Cancel') {
      this.hideForm = true;
      this.selectedFiles = [];
      this.selectedRecord = null;
      this.parentRecord = null;
      this.addProblemTypePanel.selectedRecord = null;
      this.addProblemTypePanel.parentProbType = '';
      this.selectedNode = null;
    } else if (action === "Save") {
      this.hideForm = true;
      this.messageService.clear();
      this.messageService.add({ key: 'save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
      this.selectedFiles = [];
      this.selectedRecord = null;
      this.parentRecord = null;
      this.addProblemTypePanel.selectedRecord = null;
      this.loadRecords();
      this.addProblemTypePanel.parentProbType = '';
      this.selectedNode = null;
    }

  }

  getExpandedNodes(): TreeNode[] {
    const expandedNodes: TreeNode[] = [];
    if (this.nodes) {
      this.nodes.forEach((node: TreeNode) => {
        if (node.expanded) {
          expandedNodes.push(node);
        }
      });
      return expandedNodes;
    } else {
      return expandedNodes;
    }

  }

  restoreExpandedNodes(expandedNodes: TreeNode[]): void {
    const visitNode = (node: TreeNode) => {
      if (node.expanded) {
        node.expanded = false;
        const foundNode = this.findNodeById(this.nodes, node.key);
        if (foundNode) {
          foundNode.expanded = true;
          if (node.children) {
            node.children.forEach((childNode: TreeNode) => {
              visitNode(childNode);
            });
          }
        }
      }
    };
    expandedNodes.forEach((node: TreeNode) => {
      visitNode(node);
    });
  }

  findNodeById(nodes: TreeNode[], id: any): TreeNode {
    let foundNode: TreeNode | undefined;
    nodes.forEach((node: TreeNode) => {
      if (node.key === id) {
        foundNode = node;
      } else if (node.children) {
        const childNode = this.findNodeById(node.children, id);
        if (childNode) {
          foundNode = childNode;
        }
      }
    });
    return foundNode as TreeNode;
  }

}

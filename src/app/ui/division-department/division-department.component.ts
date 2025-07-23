import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { DivisionService } from './services/division.services';
import { AddDivisionComponent } from './widgets/add-division/add-division.component';
import { AddDepartmentComponent } from './widgets/add-department/add-department.component';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-division-department',
  templateUrl: './division-department.component.html',
  styleUrls: ['./division-department.component.scss'],
  providers: [MessageService]
})
export class DivisionDepartmentComponent implements OnInit {

  nodes!: TreeNode[];
  selectedFiles!: TreeNode[];
  isNew: boolean = true;
  action : string ='';
  selectedRecord!: any;
  compId!: number;
  loading: boolean = false;
  selectedNode!: any;
  expandedNodes: any[] = [];
  treeState: any = {};
  isDivisionView : boolean = false;
  isDepartmentView : boolean = false;
  isSubDepartmentView : boolean = false;
  displayData :any;
  reqitems: MenuItem[] = [];
  @ViewChild(AddDivisionComponent, { static: false }) adddivisionPanel!: AddDivisionComponent;
  @ViewChild(AddDepartmentComponent, { static: false }) adddepartmentPanel!: AddDepartmentComponent;
  constructor(
    private divisionSrv: DivisionService,
    private messageService: MessageService,
  ) {
    this.reqitems = [
      {
        'label': 'Division',
        'icon': 'pi pi-plus',
        command: (event) => {
          this.addDivision();
        }
      },
      {
        'label': 'Department',
        'icon': 'pi pi-plus',
        command: (event) => {
          this.addDepartment();
        }
      },
      {
        'label': 'Sub Department',
        'icon': 'pi pi-plus',
        command: (event) => {
          this.addSubDepartment();
        }
      }
    ];
   }

  ngOnInit(): void {
   this.loadRecords();
  }
    
  loadRecords(){
    const expandedNodes = this.getExpandedNodes();
    this.loading = true;
    this.nodes = [];
    this.divisionSrv.getAllDivisionTreeList().subscribe((res: any) => {
      this.nodes = res;
      this.loading = false;
      expandedNodes.length > 0 ? this.restoreExpandedNodes(expandedNodes) : '';
    })
    
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

  nodeSelect(event: any) {
    this.treeState.selectedNode = event.node;
    if(event.node.parent === undefined){
      this.isNew=false;
      this.isDivisionView = true;
      this.isDepartmentView = false;
      this.isSubDepartmentView = false;
      this.action = "Edit";
      this.displayData = event.node.data;
      
    }else if(event.node.parent.parent== undefined){
      this.isNew=false;
      this.isDivisionView = false;
      this.isDepartmentView = true;
      this.isSubDepartmentView = false;
      this.action = "Edit";
      this.displayData = event.node.data;
    }else{
      this.isNew=false;
      this.isDivisionView = false;
      this.isDepartmentView = false;
      this.isSubDepartmentView = true;
      this.action = "Edit";
      this.displayData = event.node.data;
    }
    this.selectedRecord = event.node.data;
    this.selectedNode = event.node;
  }

  onNodeExpand(event: any){
    if (!this.treeState.expandedNodes) {
      this.treeState.expandedNodes = [];
    }
    this.treeState.expandedNodes.push(event.node);
  }
  addDivision(){
    this.isNew=true;
    this.isDivisionView = true;
    this.isDepartmentView = false;
    this.isSubDepartmentView = false;
    this.action = "Add";
    let data ={
      divId: 0,
      divCode:'',
      description: '',
      highlightColor: '#a6a6a6',
      divHead: null
    }
    this.displayData = data;
  }

  addDepartment(){
    this.isNew=true;
    this.isDivisionView = false;
    this.isDepartmentView = true;
    this.isSubDepartmentView = false;
    this.action = "Add";
    let data ={
      depId: 0,
      depCode:'',
      description: '',
      highlightColor: '#a6a6a6',
      depHead: null,
      divId: null,
    }
    this.displayData = data;
  }

  addSubDepartment(){
    this.isNew=true;
    this.isDivisionView = false;
    this.isDepartmentView = false;
    this.isSubDepartmentView = true;
    this.action = "Add";
    let data ={
      subDepId:0,
      depId: null,
      subDepCode:'',
      description: '',
      highlightColor: '#a6a6a6',
      subDepHead: null,
      divId: null,
    }
    this.displayData = data;
  }

  refresh(action:any){
    this.selectedFiles = [];
    this.selectedRecord = null;
    this.isDivisionView = false;
    this.isDepartmentView = false;
    this.isSubDepartmentView = false;
    this.displayData= null;
    if(action){
      this.messageService.clear();
      this.messageService.add({ key: 'save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
      this.loadRecords();
    }
  }

}

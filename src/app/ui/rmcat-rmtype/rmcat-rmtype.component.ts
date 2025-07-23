import { Component, OnInit } from '@angular/core';
import { TreeNode, MenuItem, MessageService } from 'primeng/api';
import { RmcatService } from 'src/app/services/rmcat.service';

@Component({
  selector: 'app-rmcat-rmtype',
  templateUrl: './rmcat-rmtype.component.html',
  styleUrls: ['./rmcat-rmtype.component.scss'],
  providers: [MessageService]
})
export class RmcatRmtypeComponent implements OnInit {
  loading: boolean = false;
  nodes!: TreeNode[];
  selectedFiles!: TreeNode[];
  isNew: boolean = true;
  action : string ='';
  selectedRecord!: any;
  compId!: number;
  selectedNode!: any;
  expandedNodes: any[] = [];
  treeState: any = {};
  isrmcatview : boolean = false;
  isrmtypeview : boolean = false;
  displayData :any;
  reqitems: MenuItem[] = [];
  constructor(
    private rmcatservice:RmcatService,
    private messageService: MessageService,
  ) { 
    this.reqitems = [
      {
        'label': 'Room Category',
        'icon': 'pi pi-plus',
        command: (event) => {
          this.addRoomCategory();
        }
      },
      {
        'label': 'Room Type',
        'icon': 'pi pi-plus',
        command: (event) => {
          this.addRoomType();
        }
      }
    ];
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  addRoomCategory(){
    this.isNew=true;
    this.isrmcatview = true;
    this.isrmtypeview = false;
    this.action = "Add";
    let data ={
      rmcatId:0,
      rmCat: '',
      rmCatDesc: '',
      highlightColor: '#a6a6a6',
     
    }
    this.displayData = data;
  }

  addRoomType(){
    this.isNew=true;
    this.isrmcatview = false;
    this.isrmtypeview = true;
    this.action = "Add";
    let data ={
      rmtypeId:0,
      rmcatId:null,
      rmType: '',
      rmTypeDesc: '',
      highlightColor:'#a6a6a6',
     
    }
    this.displayData = data;
  }

  loadRecords(){
    const expandedNodes = this.getExpandedNodes();
    this.loading = true;
    this.nodes = [];
    this.rmcatservice.getAllRmCatTreeList().subscribe((res: any) => {
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
      this.isrmcatview = true;
      this.isrmtypeview = false;
      this.action = "Edit";
      this.displayData = event.node.data;
      
    }else{
      this.isNew=false;
      this.isrmcatview = false;
      this.isrmtypeview = true;
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

  refresh(action:any){
    this.selectedFiles = [];
    this.selectedRecord = null;
    this.isrmcatview = false;
    this.isrmtypeview = false;
    this.displayData= null;
    if(action=="save"){
      this.messageService.clear();
      this.messageService.add({ key: 'save', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
      this.loadRecords();
    }
  }


}

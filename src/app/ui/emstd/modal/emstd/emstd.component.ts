import { Component, OnInit, ViewChild } from '@angular/core';
import { EmStd } from '../../model/emstd.model';
import { EmStdService } from '../../service/emstd.service';
import { AddEmstdComponent } from '../../widgets/add-emstd/add-emstd.component';
import { EmstdListComponent } from '../../widgets/emstd-list/emstd-list.component';

@Component({
   selector: 'app-emstd',
    templateUrl: './emstd.component.html',
     styleUrls: ['./emstd.component.scss']
   })
export class EmstdComponent implements OnInit {

  
  @ViewChild(EmstdListComponent) roleGrid!: EmstdListComponent;
  @ViewChild(AddEmstdComponent) rolePanel!:AddEmstdComponent
  isNew:boolean=false;
  rec:EmStd|null;
  title_suffix: string ="Employee Standard";
  role_title: string = "";
  isShowPanel:boolean = false;
  constructor(private emstdSrv:EmStdService) { 
    this.rec =null;
  }

  ngOnInit(): void {
  }
  

  getData(event:any){
    this.rec = null
    if (event && event.data){
      this.isNew=false;
      this.isShowPanel=true;
      this.rec = event.data;
      this.role_title = "Edit " + this.title_suffix;

    }
    else{
      this.isShowPanel = false;
    }
      
  }
  onAdd(){
    this.isShowPanel=true;
    this.isNew = true;
   
    let data ={
      emstdId:0,
      emStd: '',
      emStdDesc: '',
      highlightColor:'#a6a6a6',
    }
    this.rec = data;
    this.role_title = "Add " + this.title_suffix;
  }
  getNotify(event:any){
    if(event == "cancel"){
      this.isShowPanel =false;
    }
    else if( event == "save"){
      this.isShowPanel =false;
      this.roleGrid.loadEmStd();
    }
  }
}


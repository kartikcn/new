import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserSreenProcs } from '../../model/dto/user-screen-procs.dto';
import { UserProcsService } from '../../service/user-procs.service';

@Component({
  selector: 'app-user-unassign-screens',
  templateUrl: './user-unassign-screens.component.html',
  styleUrls: ['./user-unassign-screens.component.scss']
})
export class UserUnassignScreensComponent implements OnInit {

  userUnAssignScreens:any[]=[];
  role: string = "";
  selectedScreens:any[]=[];
  userRoleId:number = 0;
  @Output() allScreenProcsPanels = new EventEmitter();
  constructor(
    private userProcsSrv: UserProcsService,
  ) { }

  ngOnInit(): void {
  //  this.loadUserUnAssignScreens(this.role);
    
  }
  loadUserUnAssignScreens(userRoleData:any):void{
    this.role = userRoleData.roleName;
    this.userRoleId = userRoleData.userRoleId;
    this.selectedScreens = [];
    if (this.role.length >1){
      let postData = {
        "userRoleId": this.userRoleId
      };
      this.userProcsSrv.getUnAssignUserScreens(postData).subscribe((res) => {
        if(this.role === 'Application Admin'){
          this.userUnAssignScreens = res;
        }else{
          this.userUnAssignScreens = res.filter(t => t.screenName != "Add or Edit Company");
          this.userUnAssignScreens = this.userUnAssignScreens.filter(t =>  t.screenName  != "User Plan Report");
          this.userUnAssignScreens = this.userUnAssignScreens.filter(t =>  t.screenName != "Add or Edit Cost" );
        }
      }, error => {
        
      })
    }
    else
      this.userUnAssignScreens = [];
    
  }
  onAssign(){
    const dataRecord: UserSreenProcs = {
      userProcs: this.prepareDataRecord()
    }
    this.userProcsSrv.saveUserAssignScreens(dataRecord).subscribe((res) => {
      this.allScreenProcsPanels.emit("true");
    }, error => { console.log(error); });
  }
  prepareDataRecord(){
    let dataArray:any[]=[];

    this.selectedScreens.forEach(x=>{
      const rec:any ={
        "processId": x.processId,
        "screenNum":x.screenNum,
        "userScreensNum":0,
        "userRoleId":this.userRoleId,
        "subProcessId":x.subProcessId
      }
      dataArray.push(rec);
    });
    return dataArray;
  }

}

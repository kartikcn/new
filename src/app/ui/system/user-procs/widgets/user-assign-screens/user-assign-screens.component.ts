import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserSreenProcs } from '../../model/dto/user-screen-procs.dto';
import { UserScreenOutput } from '../../model/UserScreenOutput.model';
import { UserProcsService } from '../../service/user-procs.service';

@Component({
  selector: 'app-user-assign-screens',
  templateUrl: './user-assign-screens.component.html',
  styleUrls: ['./user-assign-screens.component.scss']
})
export class UserAssignScreensComponent implements OnInit {

  role: string = "";
  assignUserScreens: any[] = [];
  selectedScreens: UserScreenOutput[] =[];
  loading:boolean=false;
  userRoleId: number = 0;
  
  @Output() allScreenProcsPanels = new EventEmitter();

  constructor(
    private userProcSrv: UserProcsService,
    private autSrv: AuthService
  ) { }

  ngOnInit(): void {
    if (this.role.length > 1)
      this.loadAssignUsersScreen(this.role);


  }
  loadAssignUsersScreen(userRoleData: any): void {
    this.selectedScreens=[];
    this.role = userRoleData.roleName;
    this.userRoleId = userRoleData.userRoleId;
    this.loading=true;
    if (this.role.length > 1) {
      let postData = {
        "userRoleId": this.userRoleId
      }
      this.userProcSrv.getAssignUserScreens(postData).subscribe((res) => {
        if(this.role === 'Application Admin'){
          this.assignUserScreens = res;
        }else{
          this.assignUserScreens = res.filter(t => t.screenName != "Add or Edit Company");
          this.assignUserScreens = this.assignUserScreens.filter(t =>  t.screenName  != "User Plan Report");
          this.assignUserScreens = this.assignUserScreens.filter(t =>  t.screenName != "Add or Edit Cost" );
        }
        this.loading = false;

      }, error => { console.log(error)
        this.loading = false;
       });
    }
    else
      this.assignUserScreens = [];
    this.loading = false;
  }
  onUnAssign() {
    console.log(this.selectedScreens);

    const dataRecord: UserSreenProcs ={
      userProcs:this.selectedScreens
    }
    this.userProcSrv.deleteUserAssignScreens(dataRecord).subscribe((res)=>{
      this.allScreenProcsPanels.emit("true");
    },error=>{console.log(error);});

  }

  

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RmTeamsService } from '../../service/room-teams.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-unassign-rooms',
  templateUrl: './unassign-rooms.component.html',
  styleUrls: ['./unassign-rooms.component.scss'],
  providers: [MessageService]
})
export class UnassignRoomsComponent implements OnInit {
  assignRoom!: UntypedFormGroup;
  roomsData:any[]=[];
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedScreens: any[] = [];
  @Output() unAssignSgPanels= new EventEmitter();
  @Input() presentTeamId :string ='';
  selectedRoom :any;
  maxOccupancyValue:number = 100;
  allRmTeamsData :any[]=[];
  displayUnAssignScreen:boolean = false;
  compId!: number;
  constructor(
    private rmteamsrv:RmTeamsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authSrv: AuthService,
    private formBuilder: UntypedFormBuilder,
  ) { 
    this.assignRoom = this.formBuilder.group({
      occupancyValue: [null,[Validators.required]],
    })
  }

  ngOnInit(): void {
    this.compId = this.authSrv.getLoggedInUserCompId();
  }

  loadRecords(teamId:any){
    this.rmteamsrv.getAssignedRooms(teamId).subscribe((res:any)=>{
      if(res){
        this.roomsData = res;
      }
    })
    this.loadAllRmTeamData();
  }

  onUnAssign(){
    this.messageService.clear();
    const deleteRequests:any[] = [];
    this.selectedScreens.forEach((screen:any)=>{
      let data ={
        compId:0,
        blId:screen.blId,
        flId:screen.flId,
        rmId:screen.rmId,
        teamId:screen.teamId,
        allocation:screen.allocation
      }
      deleteRequests.push(this.rmteamsrv.deleteRmTeam(data));
    })
    forkJoin(deleteRequests)
      .subscribe((res:any[])=>{
        this.messageService.add({ key: 'UsgGrid', severity: 'success', summary: 'Team unassigned successfully', detail: 'Team unassigned successfully' });
        this.refreshPanel();
      });
  }

  refreshPanel() {
    this.unAssignSgPanels.emit(true);
  }

  openEditItem(room:any){
    this.assignRoom.patchValue({
      occupancyValue: null,
    })
    this.allRmTeamsData.forEach((rm:any)=>{
      if(rm.blId==room.blId && rm.flId==room.flId && rm.rmId==room.rmId &&rm.teamId!=room.teamId){
        this.maxOccupancyValue -= rm.allocation;
      }
    });
    this.displayUnAssignScreen = true;
    this.selectedRoom = room;
  }

  loadAllRmTeamData(){
    this.maxOccupancyValue =100;
    this.rmteamsrv.getAllRmTeams().subscribe((res:any)=>{
      this.allRmTeamsData = res;
    });
  }

  saveOccupancyValue(){
    this.messageService.clear();
    let data = {
      compId:this.compId,
      blId:this.selectedRoom.blId,
      flId:this.selectedRoom.flId,
      rmId:this.selectedRoom.rmId,
      teamId:this.selectedRoom.teamId,
      allocation:this.assignRoom.controls.occupancyValue.value
    }
    this.rmteamsrv.updateRmTeam(data).subscribe((res:any)=>{
      if(res){
        this.displayUnAssignScreen = false;
        this.messageService.add({ key: 'UsgGrid', severity: 'success', summary: 'Team updated successfully', detail: 'Team updated successfully' });
        this.refreshPanel();
      }
    })
  }

  cancelOccupancyValue(){
    this.displayUnAssignScreen = false;
    this.assignRoom.patchValue({
      occupancyValue: null,
    })
  }

  checkOccupancyValue(control:any){
    if (control.value !== undefined && control.value != null && control.value.length > 0 && this.displayUnAssignScreen ) {
      this.assignRoom.controls['occupancyValue'].setErrors(null);
      this.assignRoom.clearAsyncValidators();
      this.assignRoom.updateValueAndValidity();
      if(parseInt(control.value)> this.maxOccupancyValue){
        this.assignRoom.controls['occupancyValue'].setErrors({ 'incorrect': true });
          this.assignRoom.updateValueAndValidity();
          return { 'incorrect': true };
      }
      else{
        return null;
      }
    }
    return null;
  }

  limitToThreeDigits(event:any){
    const input = event.target.value ;
    if(input.length>3){
      this.assignRoom.patchValue({
        occupancyValue: input.slice(0,3),
      })
    }
  }

}

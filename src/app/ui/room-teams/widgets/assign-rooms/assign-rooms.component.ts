import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RmTeamsService } from '../../service/room-teams.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assign-rooms',
  templateUrl: './assign-rooms.component.html',
  styleUrls: ['./assign-rooms.component.scss'],
  providers: [MessageService]
})
export class AssignRoomsComponent implements OnInit {
  roomsData:any[]=[];
  rowCount: number = UtilConstant.ROW_COUNT;
  allRoomsData :any[]=[];
  allRmTeamsData :any[]=[];
  compId!: number;
  selectedScreens:any[]=[];
  displayAssignScreen:boolean = false;
  assignRoom!: UntypedFormGroup;
  @Output() assignSgPanels= new EventEmitter();
  @Input() presentTeamId :string ='';
  minAvailibility:number=0;
  minAvailRmid:string ='';
  constructor(
    private rmteamsrv:RmTeamsService,
    private authSrv: AuthService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
  ) { 
    this.assignRoom = this.formBuilder.group({
      occupancyValue: [null,[Validators.required]],
    })
  }

  ngOnInit(): void {
    this.compId = this.authSrv.getLoggedInUserCompId();
  }

  onAssign(){
    this.assignRoom.patchValue({
      occupancyValue: null,
    })
    this.minAvailibility = this.selectedScreens[0].availability;
    this.minAvailRmid = this.selectedScreens[0].rmId;
    this.selectedScreens.forEach((screen:any)=>{
      if(screen.availability<this.minAvailibility){
        this.minAvailibility = screen.availability;
        this.minAvailRmid = screen.rmId;
      }
    })
    this.displayAssignScreen = true;
  }

  loadRecords(teamId:any){
    this.allRoomsData=[];
    this.allRmTeamsData=[];
    this.roomsData=[];
    this.selectedScreens=[];
    const getunassignedrooms = this.rmteamsrv.getUnAssignedRooms(teamId);
    const getallrmteams = this.rmteamsrv.getAllRmTeams();
    forkJoin([getunassignedrooms, getallrmteams]).subscribe(
      ([result1, result2]) => {
        console.log('Backend calls completed:', result1, result2);
        if(result1){
          result1.forEach((rm:any)=>{
            this.allRoomsData.push({blId:rm.blId,flId:rm.flId,rmId:rm.rmId,availability:100,teamId:teamId})
          })
        }
        if(result2){
          this.allRmTeamsData = result2;
        }
        this.allRoomsData.forEach((rm:any)=>{
          const matchforavail = this.allRmTeamsData.filter((obj1: any) =>
            rm.blId == obj1.blId && rm.flId == obj1.flId && rm.rmId == obj1.rmId
          );
          if(matchforavail.length>0){
            matchforavail.forEach((room:any)=>{
              const checkroom = this.allRoomsData.find((obj1:any)=>room.blId==obj1.blId && room.flId==obj1.flId && room.rmId==obj1.rmId)
              const index = this.allRoomsData.indexOf(checkroom);
              if (index !== -1) {
                this.allRoomsData[index].availability -= room.allocation;
              }
            })
          }
        })
        this.roomsData = this.allRoomsData;
      }
    );
  }

   checkOccupancyValue(control:any){
    if (control.value !== undefined && control.value != null && control.value.length > 0 && this.displayAssignScreen ) {
      this.assignRoom.controls['occupancyValue'].setErrors(null);
      this.assignRoom.clearAsyncValidators();
      this.assignRoom.updateValueAndValidity();
      if(parseInt(control.value)> this.minAvailibility){
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

  saveOccupancyValue(){
    this.messageService.clear();
    const saveRequests:any[] = [];
    this.selectedScreens.forEach((screen:any)=>{
      let data ={
        compId:this.compId,
        blId:screen.blId,
        flId:screen.flId,
        rmId:screen.rmId,
        teamId:screen.teamId,
        allocation:this.assignRoom.controls.occupancyValue.value
      }
      saveRequests.push(this.rmteamsrv.saveRmTeam(data));
    })
    forkJoin(saveRequests)
      .subscribe((res:any[])=>{
        this.displayAssignScreen = false;
        this.messageService.add({ key: 'UsgGrid', severity: 'success', summary: 'Team assigned successfully', detail: 'Team assigned successfully' });
        this.refreshPanel();
    });
  }

  cancelOccupancyValue(){
    this.displayAssignScreen = false;
    this.assignRoom.patchValue({
      occupancyValue: null,
    })
  }

  refreshPanel() {
    this.assignSgPanels.emit(true);
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

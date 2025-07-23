import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { EquipmentService } from '../Helpdesk/equipment/services/equipment.services';
import { BuildingService } from '../background-loc/services/bl.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-locate-asset',
  templateUrl: './locate-asset.component.html',
  styleUrls: ['./locate-asset.component.scss']
})
export class LocateAssetComponent {
  filterPanel!: UntypedFormGroup;
  enumEq: any[] = [];
  allAssets: any[] = [];
  viewSvg: boolean = false;
  noSVGFound: boolean = false;
  showSpinner: boolean = true;
  showRoomData: boolean = false;
  roomDetailsData:string= '';
  useTabletProtrait = false;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private formBuilder: UntypedFormBuilder,
    private equipmentservice : EquipmentService,
    private blServ: BuildingService,
    private bps : BreakpointService
  ) { 
    this.filterPanel = this.formBuilder.group({
      eqId: [null,[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadAllAssets();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }

  loadAllAssets(){
    this.equipmentservice.getAllEquipments().subscribe((res:any)=>{
      this.allAssets = res;
      this.enumEq = this.allAssets;
    })
  }

  onSearch(){
    this.noSVGFound = false;
    this.viewSvg = false;
    let eqId = this.filterPanel.controls.eqId.value;
    const eqArray = this.enumEq.filter(each => each.eqId == eqId);
    if (eqArray[0].blId !== null && eqArray[0].flId !== null && eqArray[0].rmId !== null){
      this.roomDetailsData = `Located at Building: ${eqArray[0].blCode}, Floor: ${eqArray[0].flCode}, Room: ${eqArray[0].rmCode}`;
      this.showRoomData = true;
      this.svgInputData  = new SvgRoomDataInput(eqArray[0].blId,eqArray[0].flId,eqArray[0].rmId,false,false,true,false,true,"",eqArray[0],"","",null,null);
      this.viewSvg = true;
    }else{
      this.noSVGFound = true;
      this.showRoomData = false;
      this.roomDetailsData='';
      this.viewSvg = false;
    }
  }

  onClear(){
    this.viewSvg = false;
    this.filterPanel.patchValue({
      eqId:null
    });
    this.noSVGFound = false;
    this.showRoomData = false;
    this.roomDetailsData='';
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

}

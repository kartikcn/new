import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { EmployeeService } from '../employee/services/employee.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-locate-employee',
  templateUrl: './locate-employee.component.html',
  styleUrls: ['./locate-employee.component.scss']
})
export class LocateEmployeeComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  enumEm: any[] = [];
  allEmployees: any[] = [];
  viewSvg: boolean = false;
  noSVGFound: boolean = false;
  showSpinner: boolean = true;
  showRoomData:boolean = false;
  roomDetailsData:string='';
  useTabletProtrait = false;
  limitEm: number = 0;
  offsetEm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private formBuilder: UntypedFormBuilder,
    private emSrv: EmployeeService,
    private blServ: BuildingService,
    private bps : BreakpointService
  ) { 
    this.filterPanel = this.formBuilder.group({
      emId: [null,[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }


  onSearch() {
    this.noSVGFound = false;
    this.viewSvg = false;
    let emId = this.filterPanel.controls.emId.value;
    if(emId !=null){
      this.emSrv.getEmById(emId).subscribe((res:any)=>{
        let emdata = res.employeeDetails;
        if(emdata !=null && emdata.blId!=null && emdata.flId!=null && emdata.rmId!=null){
          this.roomDetailsData = `Located at Building: ${emdata.blBlCode}, Floor: ${emdata.flFlCode}, Room: ${emdata.rmRmCode}`;
            this.showRoomData = true;
            this.svgInputData  = new SvgRoomDataInput(emdata.blId,emdata.flId,emdata.rmId,false,true,false,false,true,emdata.firstName+" "+emdata.lastName,null,"","",null,null);
            this.viewSvg = true;
        }else{
          this.noSVGFound = true;
          this.viewSvg = false;
          this.showRoomData = false;
          this.roomDetailsData='';
        }
      })
    }else{
      this.noSVGFound = true;
      this.viewSvg = false;
      this.showRoomData = false;
      this.roomDetailsData='';
    }
  }

  onClear() {
    this.viewSvg = false;
    this.filterPanel.patchValue({
      emId: null
    });
    this.svgInputData = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
    this.noSVGFound = false;
    this.showRoomData = false;
    this.roomDetailsData='';
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

 
  scrollToEndEm() {
    this.offsetEm = this.limitEm;
    this.limitEm += this.scrollLimit;
    this.filterCriteria.limit = this.limitEm;
    this.filterCriteria.offset = this.offsetEm;
    this.emSrv.getALLmployeeByScroll(this.filterCriteria).subscribe((res:any) => {
      this.enumEm = res;
      this.enumEm.unshift({emId:null, firstName:'Make a selection',emCode:null});
    })
  }

  searchEm(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "firstName", value: event.term, matchMode: "contains" };
    this.scrollToEndEm();
  }

  updateEmList(emData:any) {
    this.enumEm = this.enumEm.filter(e => e.emId != emData.emId);
    this.enumEm = this.enumEm.filter(e => e.emId != null);
    this.enumEm.unshift(emData);
    this.enumEm.unshift({emId:null, firstName:'Make a selection',emCode:null});
  }

  openEm() {
    this.limitEm = 0;
    this.offsetEm = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndEm();
  }

}

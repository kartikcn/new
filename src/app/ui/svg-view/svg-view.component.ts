import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as d3 from 'd3';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { BuildingService } from '../background-loc/services/bl.service';
import { SvgElementColorType } from 'src/app/model/svgelementcolortype.model';
import { SvgElementIdType } from 'src/app/model/svgelementidtype.model';
import { SvgRoomContentData } from 'src/app/model/svgroomcontentdata.model';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { SvgViewService } from './services/svg-view.service';
import { Observable, concatMap, of } from 'rxjs';
import { SvgElementOnClickData } from 'src/app/model/svgelementonclickdata.interface';

@Component({
  selector: 'app-svg-view',
  templateUrl: './svg-view.component.html',
  styleUrls: ['./svg-view.component.scss']
})
export class SvgViewComponent implements OnInit ,OnChanges {
  reader = new FileReader();
  fileString!: string;
  @Input() svgInputData!: SvgRoomDataInput;
  focusOnElement: boolean = false;
  @Output() onRoomClick = new EventEmitter();
  allSVGRoomsData:any[]=[];
  svgRoomData: SvgRoomData = new SvgRoomData(null, null, "", []);
  noSVGFound: boolean = false;
  object: any;
  elementToBeZoomed: any | null = null;
  focusedTransform: any | null = null;
  showSpinner: boolean = true;
  constructor(
    private spinner: NgxSpinnerService,
    private blServ: BuildingService,
    private svgViewSrv: SvgViewService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes.svgInputData.firstChange)
    {
      this.getSVGRoomData();
    }    
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.object = document.getElementById("svg-container");
      this.getSVGRoomData();
    }, 0);
  }

  setSvgContainerObject(){
    this.object = document.getElementById("svg-container");
  }

  getSVGRoomData() {
    this.showSpinner = true;
    this.spinner.show();
    this.focusOnElement = this.svgInputData.focusOnElement;
    let observableToUpdateSVGRoomData: Observable<any>;
    if (this.svgInputData.highlightSingleRoom) {
      observableToUpdateSVGRoomData = this.updateSVGRoomDataForSingleRoom(this.svgInputData.blId, this.svgInputData.flId, this.svgInputData.rmId);
    }else if(this.svgInputData.highlightSingleRoomWithEmployee){
      observableToUpdateSVGRoomData = this.updateSVGRoomDataForSingleRoomWithEmployee(this.svgInputData.blId, this.svgInputData.flId, this.svgInputData.rmId,this.svgInputData.labelString);
    }else if (this.svgInputData.highlightSingleRoomWithAsset){
      observableToUpdateSVGRoomData = this.updateSVGRoomDataForSingleRoomWithAsset(this.svgInputData.blId, this.svgInputData.flId, this.svgInputData.rmId,this.svgInputData.assetDetails);
    }else if(this.svgInputData.highlightMultipleRooms && (this.svgInputData.highlightMultipleRoomsType == "division" || this.svgInputData.highlightMultipleRoomsType == "department" || this.svgInputData.highlightMultipleRoomsType == "subDepartment" || this.svgInputData.highlightMultipleRoomsType == "rmcat" || this.svgInputData.highlightMultipleRoomsType == "rmtype" ||this.svgInputData.highlightMultipleRoomsType=="commonArea")){
      observableToUpdateSVGRoomData =this.updateSVGRoomDataForMultipleRoomsWithParameter(this.svgInputData.blId, this.svgInputData.flId,this.svgInputData.highlightMultipleRoomsTypeId,this.svgInputData.highlightColorForMultiple,this.svgInputData.highlightMultipleRoomsType);
    }else if(this.svgInputData.highlightMultipleRooms && this.svgInputData.highlightMultipleRoomsType == "rmcat-rmtype"){
      observableToUpdateSVGRoomData =this.updateSVGRoomDataForMultipleRoomsRmCatRmType(this.svgInputData.blId, this.svgInputData.flId);
    }else if(this.svgInputData.highlightMultipleRooms && this.svgInputData.highlightMultipleRoomsType == "booking"){
      observableToUpdateSVGRoomData =this.updateSVGRoomDataForMultipleRoomsBooking(this.svgInputData.bookingSvgElementsData);
    }
    else{
      observableToUpdateSVGRoomData = of(null);
    }
    observableToUpdateSVGRoomData.pipe(
      concatMap(async () => this.getSvgFile())
    ).subscribe(
      () => {
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    
  }

  updateSVGRoomDataForSingleRoom(blId: any, flId: any, rmId: any) {
    this.svgRoomData = new SvgRoomData(null, null, "", []);
    this.svgRoomData.blId = blId;
    this.svgRoomData.flId = flId;
    this.svgRoomData.locate = "room";
    return this.blServ.getRmById(rmId).pipe(
      concatMap((res: any) => {
        let idObj: SvgElementIdType = {
          roomElementId: res.rm.svgElementId,
          assetElementId: null
        };
        let colorObj: SvgElementColorType = {
          roomColor: "#ff0000",
          assetColor: null
        };
        let contentData: SvgRoomContentData = {
          blId: blId,
          flId: flId,
          rmId: res.rm.rmId,
          label: [res.rm.rmCode],
          showLabel: true,
          highlightRoom: true,
          svgElementId: idObj,
          color: colorObj,
          rmCode: res.rm.rmCode,
          zoomAtRoom: true
        };
        this.svgRoomData.content.push(contentData);
        return of(null);
      })
    );
  }

  updateSVGRoomDataForSingleRoomWithEmployee(blId: any, flId: any, rmId: any,empLabel:string){
    this.svgRoomData = new SvgRoomData(null, null, "", []);
    this.svgRoomData.blId = blId;
    this.svgRoomData.flId = flId;
    this.svgRoomData.locate = "room";
    return this.blServ.getRmById(rmId).pipe(
      concatMap((res: any) => {
        let idObj: SvgElementIdType = {
          roomElementId: res.rm.svgElementId,
          assetElementId: null
        };
        let colorObj: SvgElementColorType = {
          roomColor: "#ff0000",
          assetColor: null
        };
        let contentData: SvgRoomContentData = {
          blId: blId,
          flId: flId,
          rmId: res.rm.rmId,
          label: [`${res.rm.bl.blCode}-${res.rm.fl.flCode}-${res.rm.rmCode}`,empLabel],
          showLabel: true,
          highlightRoom: true,
          svgElementId: idObj,
          color: colorObj,
          rmCode: res.rm.rmCode,
          zoomAtRoom: true
        };
        this.svgRoomData.content.push(contentData);
        return of(null);
      })
    );
  }

  updateSVGRoomDataForSingleRoomWithAsset(blId: any, flId: any, rmId: any, eq:any){
    this.svgRoomData = new SvgRoomData(null, null, "", []);
    this.svgRoomData.blId = blId;
    this.svgRoomData.flId = flId;
    this.svgRoomData.locate = "asset";
    return this.blServ.getRmById(rmId).pipe(
      concatMap((res: any) => {
        let idObj:SvgElementIdType ={
          roomElementId:res.rm.svgElementId,
          assetElementId : eq.svgElementId
        }
        let colorObj: SvgElementColorType ={
          roomColor:"#9999ff",
          assetColor: "#ff0000"
        }
        let contentData:SvgRoomContentData ={
          blId:eq.blId,
          flId:eq.flId,
          rmId:eq.rmId,
          label:[eq.eqCode,eq.rmCode],
          showLabel:true,
          highlightRoom:true,
          svgElementId : idObj,
          color:colorObj,
          rmCode:'',
          zoomAtRoom:true
        }
        this.svgRoomData.content.push(contentData);
        return of(null);
      })
    );
  }

  updateSVGRoomDataForMultipleRoomsWithParameter(blId: any, flId: any, parameterId: any,color:string,param:string){
    this.svgRoomData = new SvgRoomData(null, null, "", []);
    this.svgRoomData.blId = blId;
    this.svgRoomData.flId = flId;
    this.svgRoomData.locate = "room";
    let idname = this.getParameterNameForMutipleRoomHighlight(param);
    let data ={
      blId:blId,
      flId:flId,
      [idname] : parameterId
    }
    return this.blServ.getRmList(data).pipe(
      concatMap((res: any) => {
        let resultData = res.filter((each:any)=> each.svgElementId !=null);
        resultData.forEach((element:any) => {
          let idObj:SvgElementIdType ={
            roomElementId:element.svgElementId,
            assetElementId : null
          }
          let colorObj: SvgElementColorType ={
            roomColor:color,
            assetColor: null
          }
          let contentData:SvgRoomContentData ={
            blId:blId,
            flId:flId,
            rmId:element.rmId,
            label:[element.rmCode],
            showLabel:true,
            highlightRoom:true,
            svgElementId : idObj,
            color:colorObj,
            rmCode:element.rmCode,
            zoomAtRoom:false
          }
          this.svgRoomData.content.push(contentData);
        });
        return of(null);
      })
    );
  }

  updateSVGRoomDataForMultipleRoomsRmCatRmType(blId: any, flId: any){
    this.svgRoomData = new SvgRoomData(null, null, "", []);
    this.svgRoomData.blId = blId;
    this.svgRoomData.flId = flId;
    this.svgRoomData.locate = "room";
    let data ={
      blId:blId,
      flId:flId,
    }
    return this.blServ.getrmwithcatortypecolor(data).pipe(
      concatMap((res: any) => {
        let resultData = res.filter((each:any)=> each.svgElementId !=null);
        this.allSVGRoomsData = [...resultData];
        resultData.forEach((rm:any)=>{
          let labeldata =[];
          if(rm.rmType!=null && rm.rmType!=''){
            labeldata.push(rm.rmType);
          }
          if(rm.rmCat!=null && rm.rmCat!=''){
            labeldata.push(rm.rmCat);
          }
          labeldata.push(rm.rmCode);
          let idObj:SvgElementIdType ={
            roomElementId:rm.svgElementId,
            assetElementId : null
          }
          let colorObj: SvgElementColorType ={
            roomColor:rm.highlightColor,
            assetColor: null
          }
          let contentData:SvgRoomContentData ={
            blId:parseInt(blId),
            flId:parseInt(flId),
            rmId:rm.rmId,
            label:[...labeldata],
            showLabel:true,
            highlightRoom:rm.highlightColor!=null?true:false,
            svgElementId :idObj,
            color:colorObj,
            rmCode:rm.rmCode,
            zoomAtRoom:false
          }
          this.svgRoomData.content.push(contentData);
        })
        return of(null);
      })
    );
  }

  updateSVGRoomDataForMultipleRoomsBooking( SvgElementsData:SvgRoomData|null){
    if(SvgElementsData != null){
      this.svgRoomData = {...SvgElementsData};
    }
    return of(null);
    
  }

  getParameterNameForMutipleRoomHighlight(param:string){
    let result = "";
    if(param=="division"){
      result= "divId";
    }else if (param=="department"){
      result= "depId";
    }else if (param=="subDepartment"){
      result= "subDepId";
    }else if (param=="rmcat"){
      result= "rmcatId";
    }else if (param=="rmtype"){
      result= "rmtypeId";
    }else if(param=="commonArea"){
      result ="commonAreaType";
    }
    return result;
  }

  getSvgFile() {
    if (this.svgRoomData.content[0] == undefined) {
      this.spinner.hide();
      this.showSpinner = false;
      this.noSVGFound = true;
      this.cdr.detectChanges();
    } else {
      let data ={
        blId:this.svgInputData.blId,
        flId:this.svgInputData.flId
      }
      if (this.svgRoomData.content[0].svgElementId !== null) {
        this.svgViewSrv.getSVGFile(data).subscribe((res: any) => {
          if (res.code != 409) {
            this.fileString = res.fileContent;
            this.noSVGFound = false;
            this.cdr.detectChanges();
            this.setSvgContainerObject();
            this.loadSvgFile();
          }
          else {
            this.spinner.hide();
            this.showSpinner = false;
            this.noSVGFound = true;
            this.cdr.detectChanges();
          }
        })
      } else {
        this.spinner.hide();
        this.showSpinner = false;
        this.noSVGFound = true;
        this.cdr.detectChanges();
      }
    }
  }

  loadSvgFile() {
    this.object!.innerHTML = "";
    let abc = d3.select('#svg-container');
    if (this.fileString != '') {
      this.object!.innerHTML = this.fileString;
    }
    this.cdr.detectChanges();
    let mySvg = abc.select("svg");
    let viewer = abc.select("#viewer");
    mySvg.select("title").remove();
    mySvg.select("desc").remove();
    this.loadByDetails();
    let zoomed = (event: any) => {
      let transform = event.transform;
      if (this.focusedTransform != null) {
        //viewer.attr('transform', `translate(${-1*(this.focusedTransform.x-transform.x)},${-1*(this.focusedTransform.y-transform.y)}) scale(${transform.k},-${transform.k})`);
        viewer.attr('transform', `translate(${this.focusedTransform.x + transform.x},${this.focusedTransform.y + transform.y}) scale(${transform.k},-${transform.k})`);
      } else {
        viewer.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k},-${transform.k})`)
      }
    }
    let zoom = d3.zoom().on("zoom", zoomed).scaleExtent([0.5, 20]);
    // @ts-ignore
    mySvg.call(zoom);
    mySvg.attr("width", "100%")
      .attr("height", "auto");
    this.roomOnClickListener();
    this.focusToSelection();
    this.spinner.hide();
    this.showSpinner = false;
  }

  roomOnClickListener() {
    let abc = d3.select('#svg-container');
    let mySvg = abc.select("svg");
    let room_layer = mySvg.select('#ROOM');
    let elementIdName ="";
    let data : SvgElementOnClickData={
      elementIdName: "",
      svgRoomData : {...this.svgRoomData},
      allSVGRoomsData : [...this.allSVGRoomsData]
    }
    room_layer.selectAll('path').on('click', (event: any) => {
      elementIdName = (event.target as HTMLInputElement).id;
      data.elementIdName = elementIdName;
      this.onRoomClick.emit(data);
    })
    room_layer.select('#text_g').selectAll('foreignObject').selectAll('.label-container').on('click', (event: any) => {
      elementIdName = (event.currentTarget as HTMLInputElement).id;
      data.elementIdName = elementIdName;
      this.onRoomClick.emit(data);
    })
  }

  loadByDetails() {
    let blId = this.svgRoomData.blId;
    let flId = this.svgRoomData.flId;
    let abc = d3.select('#svg-container');
    let mySvg = abc.select("svg");
    let viewer = abc.select("#viewer");
    let externalFunctions = this;
    if (!viewer.select("#text_g").node()) {
      viewer.append("g").attr("id", "text_g");
    }
    let textElement = d3.select("#text_g");
    textElement.html("");
    if (this.svgRoomData.locate == 'room') {
      viewer.select('#ROOM').selectAll('path').style("fill", "transparent").style("stroke", "transparent");
      this.svgRoomData.content.forEach((room: any) => {
        if (room.svgElementId.roomElementId != null) {
          let rm = viewer.select("#ROOM").select("#" + room.svgElementId.roomElementId);
          externalFunctions.highlightandlabelobject(room, rm, textElement, room.color.roomColor);
          if (room.zoomAtRoom) {
            this.elementToBeZoomed = rm;
          }
        }
      })
    } else if (this.svgRoomData.locate == 'asset') {
      viewer.select('#ASSET').raise();
      viewer.select('#ASSET').selectAll('path,use').style("fill", "transparent").style("stroke", "transparent");
      this.svgRoomData.content.forEach((asset: any) => {
        if (asset.svgElementId.roomElementId != null) {
          let rm = viewer.select("#ROOM").select("#" + asset.svgElementId.roomElementId);
          externalFunctions.highlightandlabelobject(asset, rm, textElement, asset.color.roomColor);
          if (asset.zoomAtRoom) {
            this.elementToBeZoomed = rm;
          }
        }
        if (asset.svgElementId.assetElementId != null) {
          let eq = viewer.select("#ASSET").select("#" + asset.svgElementId.assetElementId);
          externalFunctions.highlightandlabelobject(asset, eq, textElement, asset.color.assetColor);
        }
      })
    }
  }

  getMediumFontSize() {
    let abc = d3.select('#svg-container');
    let viewer = abc.select("#viewer");
    let count = 0;
    let width = 0;
    let height = 0;
    this.svgRoomData.content.forEach((room: any) => {
      let rm = viewer.select("#ROOM").select("#" + room.svgElementId.roomElementId);
      if (rm.node() != null) {
        //@ts-ignore
        let dDetails = rm.node().getBBox();
        width += dDetails.width;
        height += dDetails.height;
        count++;
      }
    });
    width = width / count;
    height = height / count;
    return (width + height) / 2;
  }

  highlightandlabelobject(loopobj: any, svgobj: any, textElement: any, color: any) {
    let externalFunctions = this;
    let id = svgobj.attr("id");
    if (loopobj.highlightRoom) {
      svgobj.style('fill-opacity', '1');
      svgobj.style('opacity', '1');
      if (color) {
        svgobj.style('fill', color);
        svgobj.style('stroke', color);
      }
    }
    if (loopobj.showLabel && id.startsWith("room")) {
      if (svgobj.node() != null) {
        //@ts-ignore
        let dDetails = svgobj.node().getBBox();
        const labelcount = loopobj.label.length;
        let sizeel = externalFunctions.getMediumFontSize();
        let textForeignObject = textElement.append("foreignObject");
        textForeignObject.style("height", dDetails.height / 2).style("width", dDetails.width / 2).style("overflow", "visible");
        textForeignObject.attr("x", dDetails.x + 0.3 * dDetails.width).attr("y", dDetails.y + 0.4 * dDetails.height);
        for (let i = 0; i < labelcount; i++) {
          //@ts-ignore
          let labelContainerDiv = textForeignObject.append('xhtml:div').attr("class", "label-container").attr("id", "label_" + svgobj.node().id);
          let childTextElement1 = labelContainerDiv.append('xhtml:div');
          childTextElement1.attr("style", `height:${sizeel / 10}px;white-space: nowrap;
          overflow: hidden;text-overflow: ellipsis;width:${dDetails.width / 2}px;
          font-size:${sizeel / 12}px;transform:scale(1,-1);display:grid;align-items:center;`);
          childTextElement1.text(loopobj.label[i]);
          let childTextElement2 = labelContainerDiv.append('xhtml:div');
          childTextElement2.attr("class", "tooltip-status").attr("style", `height:${sizeel / 10}px;font-size:${sizeel / 12}px;`);
          childTextElement2.text(loopobj.label[i]);
        }
      }
    }
  }

  focusToSelection() {
    let abc = d3.select('#svg-container');
    let mySvg = abc.select("svg");
    let viewer = abc.select("#viewer");
    if (this.focusOnElement && this.elementToBeZoomed != null) {
      let bbox = this.elementToBeZoomed.node().getBBox();
      //@ts-ignore
      let mySvgBbox = mySvg.node().getBBox();
      let centerX = bbox.x + bbox.width / 2;
      let centerY = bbox.y + bbox.height / 2;
      let centroidX = mySvgBbox.x + mySvgBbox.width / 2;
      let centroidY = -mySvgBbox.y + mySvgBbox.height / 2;
      let centroidXDifference = centroidX - mySvgBbox.x;
      let centroidYDifference = centroidY + mySvgBbox.y;
      let centreXDifference = centerX - mySvgBbox.x;
      let centreYDifference = centerY + mySvgBbox.y;
      viewer.attr('transform', `translate(${centroidXDifference - centreXDifference},${-1 * (centroidYDifference - centreYDifference)}) scale(1,-1)`);
      this.focusedTransform = { x: centroidXDifference - centreXDifference, y: -1 * (centroidYDifference - centreYDifference), k: 1 };
    }
  }

}

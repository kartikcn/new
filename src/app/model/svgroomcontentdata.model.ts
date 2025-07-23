import { SvgElementColorType } from "./svgelementcolortype.model";
import { SvgElementIdType } from "./svgelementidtype.model";

export class SvgRoomContentData{

    public blId: number|null=0;
    public flId: number|null=0;
    public rmId: number|null=0;
    public label:string[];
    public showLabel: boolean;
    public highlightRoom: boolean;
    public svgElementId : SvgElementIdType;
    public color:SvgElementColorType;
    public rmCode:string;
    public zoomAtRoom: boolean;

    constructor( blId: number|null, flId: number|null, rmId:number|null,label:string[],showLabel:boolean,highlightRoom: boolean,svgElementId :SvgElementIdType,
        color:SvgElementColorType,rmCode:string,zoomAtRoom: boolean) {
        this.blId = blId;
        this.flId = flId;
        this.rmId = rmId
        this.label = label;
        this.showLabel = showLabel;
        this.highlightRoom = highlightRoom;
        this.svgElementId = svgElementId;
        this.color = color;
        this.rmCode = rmCode;
        this.zoomAtRoom = zoomAtRoom;
    }
}

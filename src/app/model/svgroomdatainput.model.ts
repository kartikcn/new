import { SvgRoomData } from "./svgroomdata.model";

export class SvgRoomDataInput{
    public blId: number|null=0;
    public flId: number|null=0;
    public rmId: number|null=0;
    public highlightSingleRoom: boolean;
    public highlightSingleRoomWithEmployee: boolean;
    public highlightSingleRoomWithAsset: boolean;
    public highlightMultipleRooms: boolean;
    public highlightMultipleRoomsType: string="";
    public highlightMultipleRoomsTypeId: number|string|null=null;
    public focusOnElement : boolean;
    public labelString : string="";
    public assetDetails : any|null=null;
    public highlightColorForMultiple : string="";
    public bookingSvgElementsData : SvgRoomData|null=null;
    constructor( blId: number|null, flId: number|null, rmId:number|null,highlightSingleRoom: boolean,highlightSingleRoomWithEmployee:boolean,
        highlightSingleRoomWithAsset: boolean, highlightMultipleRooms:boolean, focusOnElement:boolean,labelString : string, 
        assetDetails:any|null,highlightColorForMultiple : string, highlightMultipleRoomsType: string,highlightMultipleRoomsTypeId:number|string|null,
        bookingSvgElementsData : SvgRoomData|null) {
        this.blId = blId;
        this.flId = flId;
        this.rmId = rmId;
        this.highlightSingleRoom = highlightSingleRoom;
        this.highlightSingleRoomWithEmployee = highlightSingleRoomWithEmployee;
        this.highlightSingleRoomWithAsset = highlightSingleRoomWithAsset;
        this.highlightMultipleRooms = highlightMultipleRooms;
        this.focusOnElement = focusOnElement;
        this.labelString = labelString;
        this.assetDetails = assetDetails;
        this.highlightColorForMultiple =highlightColorForMultiple;
        this.highlightMultipleRoomsType = highlightMultipleRoomsType;
        this.highlightMultipleRoomsTypeId = highlightMultipleRoomsTypeId;
        this.bookingSvgElementsData = bookingSvgElementsData;
    }
}

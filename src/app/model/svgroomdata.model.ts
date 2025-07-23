import { SvgRoomContentData } from "./svgroomcontentdata.model";

export class SvgRoomData{

    public blId: number|null=0;
    public flId: number|null=0;
    public locate : string
    public content:SvgRoomContentData[];

    constructor( blId: number|null, flId: number|null,locate : string,content:SvgRoomContentData[]) {
        this.blId = blId;
        this.flId = flId;
        this.locate = locate;
        this.content = content;
        
    }
}

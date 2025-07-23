export class FloorFilterInputDTO{
    flId:number|null=0;
    flNameString: string = "";
    blId: number|null=0;
  constructor(flId: number|null, flNameString: string, blId:number|null){
      this.flId=flId;
      this.flNameString = flNameString;
      this.blId = blId;
  }
}

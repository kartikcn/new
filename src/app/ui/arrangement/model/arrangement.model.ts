export class Arrangement{
    public arrangementType?:string='';
    public description?:string='';
    public arrangementId?:number;
    public highlightColor?:string=''
    
    constructor(arrangementType: string, description: string, arrangementId:number, highlightColor:string){
        this.arrangementType=arrangementType;
        this.description = description;
        this.arrangementId = arrangementId;
        this.highlightColor = highlightColor;
}
}
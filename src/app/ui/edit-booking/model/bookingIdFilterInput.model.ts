export class BookingIdFilterInput{
    id:number=0;
    name: string = "";
    
    
    constructor(id: number, name: string){
            this.id=id;
            this.name=name;
            
    }
}
export class AccountPurchaseOrderLogInput{

        public id!:number | null;
        public  acPoId!: number;
        public dateCreated!:string;
        public timeCreated!: string;
        public comments: string ="";
        public loggedBy!: string
        public compId!: number;
        public status: string="";
        public option1: string="";

        public getStatus(){
                return "Moved to "+this.status;
        }

}
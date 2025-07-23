export class MessagesFilterInputDTO{
    msgId:number|null=0;
    processId:number|null=0;
    msgText:string="";
    msgCode:string="";
    
  constructor(msgId: number|null, processId: number|null,msgText:string,msgCode:string){
      this.msgId=msgId;
      this.processId = processId;
      this.msgText= msgText;
      this.msgCode = msgCode;
  }
}

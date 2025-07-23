import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { Messages } from "../model/messages.model";
import { MessagesFilterInputDTO } from "../model/messagesFilterInput.model";

@Injectable({
    providedIn: 'root'
})
export class MessagesService{
    constructor(
        private MessagesSrv:DataService<Messages>
        ){}

    public getAllMessages():Observable<Messages[]>{
        return this.MessagesSrv.getAll("msg","allMsgs");
    }

    public getAllMessagesPaginated(data:any){
        return this.MessagesSrv.search("msg","allMsgsPaginated",data);
    }

    public getMsgsById(data:MessagesFilterInputDTO){
        return this.MessagesSrv.search("msg","getMsgsById",data)
    }

    public updateMessages(msg:Messages):Observable<Messages>{
        return this.MessagesSrv.add("msg","saveMsg",msg);
    }

    public deleteMessageById(data:MessagesFilterInputDTO){
        return this.MessagesSrv.delete("msg","deleteMsg",data);
    }
    public getAllProcesses():Observable<any[]>{
        return this.MessagesSrv.getAll("msg","allProcesses");
    }

    public checkMsgIdExists(data:any) {
        return this.MessagesSrv.getSingle("msg", "checkMsgId", data);
    }
}
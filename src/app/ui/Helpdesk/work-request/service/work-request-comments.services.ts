import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class WrCommentsServices {

    constructor(
        private wrCommentsServices: DataService<any>
    ) { }

    public saveWrComments(data: any): Observable<any> {
        return this.wrCommentsServices.add('wrComments', 'save', data);
    }

    public getWrCommentsByWrId(wrId: any): Observable<any> {
        return this.wrCommentsServices.getAllById('wrComments', 'getById', wrId);
    }

    public getWrCommentsById(commentId:any) {
        return this.wrCommentsServices.getSingleById("wrComments","getByCommentId",commentId);
    }

}

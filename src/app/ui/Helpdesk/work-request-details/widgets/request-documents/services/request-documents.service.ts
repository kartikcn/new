import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class RequestDocumentsService {

    constructor(
        private service: DataService<any>,

    ) { }

    public saveDocuments(data: any): Observable<any> {
        return this.service.upload('requestDocuments', 'save', data);
    }

    public getDocumentsById(reqId: any) {
        return this.service.getAllById("requestDocuments", "getDocumentsByRequest", reqId);
    }

    public deleteRequestDocument(id: any) {
        return this.service.deleteById("requestDocuments", "deleteById", id);
    }

}

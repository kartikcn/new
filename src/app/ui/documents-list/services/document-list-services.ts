import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentListService {

  constructor(
    private documentListService: DataService<any>,

  ) { }

  public saveDocuments(data: any): Observable<any> {
    return this.documentListService.upload('documents', 'upload', data);
  }

  public getDocument(docBucketItemsId: any) {
    return this.documentListService.getSingleById('documents', 'download', docBucketItemsId);
  }

  public deleteDocument(docDetails: any) {
    return this.documentListService.add('documents', 'delete', docDetails);
  }

  public getListOfDocuments(docBucketId: any) {
    return this.documentListService.getAllById('documents', 'getAll', docBucketId);
  }

  public getListOfDocumentsByRequestId(requestId:any,docBucketId: any) {
    return this.documentListService.getAllByIds('documents', 'getAll',requestId, docBucketId);
  }

}

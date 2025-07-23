import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class PartsService {

    constructor(
        private partsService: DataService<any>,

    ) { }

    public getAllParts() {
        return this.partsService.getAll('parts', 'getAll');
    }

    public getAllPartsPaginated(data:any) {
        return this.partsService.search('parts', 'getAllPaginated',data);
    }


    public getByPartCode(partCode: any) {
        return this.partsService.getSingleById("parts", "getByPartCode", partCode);
    }

    public saveParts(data: any): Observable<any> {
        return this.partsService.add('parts', 'save', data);
    }

    public checkExist(partCode: any) {
        return this.partsService.getSingleById('parts', 'checkExist', partCode);
    }

    public deleteByPartCode(partCode: any) {
        return this.partsService.deleteById("parts", "deleteByPartCode", partCode);
    }
}

import { Injectable } from "@angular/core";
import { DataService } from "src/app/services/data.service";


@Injectable({
    providedIn: 'root'
})

export class SvgViewService{

    constructor(
        private SvgViewSrv:DataService<any>
        ){}

    public getSVGFile(data:any) {
        return this.SvgViewSrv.search('svg', 'getsvgfile',data)
        }

    public getRoomBySvgName(data:any) {
        return this.SvgViewSrv.search('svg', 'getroomsbysvgname',data)
    }

    public getFloorBySvgName(data:any) {
        return this.SvgViewSrv.search('svg', 'getfloorbysvgname',data)
    }
}
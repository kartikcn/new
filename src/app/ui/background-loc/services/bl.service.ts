import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BuildingFilterInput } from '../model/DTO/blFilterInput.model';
import { BLList } from '../model/bl-list.model';
import { FLList } from '../model/fl-list.model';
import { RMList } from '../model/rm-list.model';
import { FLFilterInputDTO } from '../model/DTO/flFilterInput.model';
import { CompList } from '../model/comp-list.model';
import { SiteList } from '../model/site-list.model';

const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private SiteCache$!: Observable<SiteList[]>;
  private BLCache$!: Observable<BLList[]>;
  private FLCache$!: Observable<FLList[]>;
  private RMCache$!: Observable<RMList[]>;
  private CompCache$!: Observable<CompList[]>;
  constructor(
    private blService: DataService<any>,
    private blDetailService: DataService<BLList>,
    private flDetailService: DataService<FLList>,
    private rmDetailService: DataService<RMList>,
    private compDetailService: DataService<CompList>,
    private siteSrv: DataService<SiteList>,
    
  ) { }


  searchCompanyCode(term: string) {
    if (!this.CompCache$ || this.CompCache$) {
      this.CompCache$ = this.getCompanyCode(term).pipe(shareReplay(CACHE_SIZE));
    } else {
    }
    return this.CompCache$;
  }

  private getCompanyCode(name: string): Observable<CompList[]> {
    if (name == null || name === '') {
      return of([]);
    }
    return this.compDetailService.getAllById('comp', 'searchComp', name);
  }
  searchSiteCode(term: string) {
    if (!this.SiteCache$ || this.SiteCache$) {
      this.SiteCache$ = this.getSiteCode(term).pipe(shareReplay(CACHE_SIZE));
    } else {
    }
    return this.SiteCache$;
  }

  searchBuildingCode(term: string) {
    if (!this.BLCache$ || this.BLCache$) {
      this.BLCache$ = this.getBuildingCode(term).pipe(shareReplay(CACHE_SIZE));
    } else {
    }
    return this.BLCache$;
  }
  

  private getBuildingCode(name: string): Observable<BLList[]> {
    if (name == null || name === '') {
      return of([]);
    }
    
    return this.blDetailService.getAllById('bl', 'searchBl', name);
  }
  private getSiteCode(name: string): Observable<SiteList[]> {
    if (name == null || name === '') {
      return of([]);
    }
    
    return this.siteSrv.getAllById('site', 'searchSite', name);
  }


  searchFloorCode(term: string) {
    if (!this.FLCache$ || this.FLCache$) {
      this.FLCache$ = this.getFloorCode(term).pipe(shareReplay(CACHE_SIZE));
    } else {
    }
    return this.FLCache$;
  }

  private getFloorCode(name: string): Observable<BLList[]> {
    if (name == null || name === '') { 
      return of([]);
    }
    return this.flDetailService.getAllById('fl', 'searchFl', name);
  }

  searchRoomCode(term: string) {
    if (!this.RMCache$ || this.RMCache$) {
      this.RMCache$ = this.getRoomCode(term).pipe(shareReplay(CACHE_SIZE));
    } else {
    }
    return this.RMCache$;
  }

  private getRoomCode(name: string): Observable<RMList[]> {
    if (name == null || name === '') {
      return of([]);
    }
    return this.rmDetailService.getAllById('rm', 'searchRM', name);
  }

  public getBlList(data: any){
    return this.blService.search('bl', 'getBlList', data);
  }

  public getFlList(data: FLFilterInputDTO) {
    return this.blService.search('fl', 'getFlList', data);
  }

  public getRmList(data: any) {
    return this.blService.search('rm', 'getRmList', data);
  }

  public getBlListPaginated(data: any){
    return this.blService.search('bl', 'getBlListPaginated', data);
  }

  public getFlListPaginated(data: FLFilterInputDTO) {
    return this.blService.search('fl', 'getFlListPaginated', data);
  }

  public getBlById(id:any){
    return this.blService.getSingleById('bl', 'getBlById',id);
  }

  public getFlById(flId: any) {
    return this.blService.getSingleById('fl', 'getFlById', flId);
  }

  public getRmById(rmId: any) {
    return this.blService.getSingleById('rm', 'getRmById', rmId);
  }

  public getALLCompany() {
    return this.blService.getAll("comp", "getAllCompany");
  }

  public getALLBuilding() {
    return this.blService.getAll("bl", "getAllBl");
  }

  public getALLFloor() {
    return this.blService.getAll("fl", "getAllFl");
  }

  public getALLRoom() {
    return this.blService.getAll("rm", "getAllRm");
  }

  public saveBuilding(bl: BLList): Observable<BLList> {
    return this.blDetailService.add('bl', 'saveBL', bl);
  }

  public saveFloor(bl: FLList): Observable<FLList> {
    return this.flDetailService.add('fl', 'saveFL', bl);
  }

  public saveRoom(rm:any): Observable<RMList> {
    return this.rmDetailService.add('rm', 'saveRM', rm);
  }
  
  public deleteBuilding(blId:any){
    return this.blService.getSingleById('bl','delete',blId);
  }

  public deleteFloor(flId: any){
   return this.blService.getSingleById('fl','delete',flId);
  }

  public deleteRoom(rmId: any) {
    return this.blService.getSingleById('rm', 'delete', rmId);
  }

  public checkSvgNameExists(data:any){
    return this.blService.getSingle('fl','floorexistssvg',data);
  }

  public checkBlIdAndSiteIdExists( data : any ){
    return this.blService.search('bl','checkblidexists',data);
  }

  public checkFlIdAndBlIdExists( data : any ){
    return this.blService.search('fl','checkflidexists',data);
  }

  public checkRmIdAndFlIdAndBlIdExists( data : any ){
    return this.blService.search('rm','checkrmidexists',data);
  }

  public getAllTimeZones() {
    return this.blService.getAll('bl','getAllTimeZones');
  }

  // this save method will only update rmcat, rmtype , div , dep in rm table
  public updateRoomProp(rm:any): Observable<any> {
    return this.rmDetailService.add('rm', 'updatermprop', rm);
  }

  public getrmwithdivordepcolor(data: any) {
    return this.blService.search('rm', 'getrmwithdivordeptcolor', data);
  }

  public getrmwithcatortypecolor(data: any) {
    return this.blService.search('rm', 'getrmwithcatortypecolor', data);
  }

  // public getrmwithdivisioncolor(data: any) {
  //   return this.blService.search('rm', 'getrmwithdivisioncolor', data);
  // }

  // public getrmwithdepartmentcolor(data: any) {
  //   return this.blService.search('rm', 'getrmwithdepartmentcolor', data);
  // }

  // public getrmwithrmcatcolor(data: any) {
  //   return this.blService.search('rm', 'getrmwithrmcatcolor', data);
  // }

  // public getrmwithrmtypecolor(data: any) {
  //   return this.blService.search('rm', 'getrmwithrmtypecolor', data);
  // }

  public getrmwithparametercolor(data: any) {
    return this.blService.search('rm', 'getrmwithparametercolor', data);
  }

  public getRoomReportsByFilter(data:any) {
    return this.blService.search('rm', 'resportsByGroup', data);
  }

  public getRoomReportsByFilterPaginated(data:any) {
    return this.blService.search('rm', 'resportsByGroupPaginated', data);
  }

  public getRoomByFilter(data: any) {
    return this.blService.search('rm', 'reportfilter', data);
  }

  public getCommonAreaByFloor(data:any){
    return this.blService.search("rm", "getareabycommonarea", data);
  }

  public getspaceutilizationrmdata(data:any){
    return this.blService.search("rm", "spaceutilizationrmdata", data);
  }

  public getdepartmentallocation(data:any){
    return this.blService.search("rm", "spacedivdepallocation", data);
  }

  public getspaceallocationstatictics(data:any){
    return this.blService.search("rm","spaceallocationbystatistics",data);
  }

  public getspaceallocationstaticticsPaginated(data:any){
    return this.blService.search("rm","spaceallocationbystatisticspaginated",data);
  }

  public getspaceallocationstaticticsroomdata(data:any){
    return this.blService.search("rm","spaceallocationbystatisticsrmdata",data);
  }

  public getspaceallocationreportbyblfldivdep(data:any){
    return this.blService.search("rm","spaceallocationreportbyblfldivdep",data);
  }

  public getroomspaceavailibilitydetails(data:any){
    return this.blService.search("rm","spaceunallocatedroomdetails",data);
  }

  public getallfloorwitharea(){
    return this.blService.getAll("fl","getareabyfloor");
  }

  public getallbuildingwitharea(){
    return this.blService.getAll("bl","getbuildingwitharea");
  }

  public getbuildingwiseallocation(data:any){
    return this.blService.search("bl","buildingwiseallocation",data);
  }

  public unLinkFloorPlan(flId: any) {
    return this.blService.getSingleById('fl', 'unlinkFloorPlan', flId);
  }

  public getRmListByPagination(data: any) {
    return this.blService.search('rm', 'getRmListByPagination', data);
  }

  public getPaginatedResevRoom(data: any) {
    return this.blService.search('rm', 'getPaginatedResevRm', data);
  }

  public getPaginatedHotelRoom(data: any) {
    return this.blService.search('rm', 'getPaginatedHotelRm', data);
  }
  
  public getALLBuildingByScroll(data:any) {
    return this.blService.search("bl", "getAllBlByScroll",data);
  }

  public getALLFloorByScroll(data:any) {
    return this.blService.search("fl", "getAllFlByScroll",data);
  }	

  public getALLRoomByScroll(data:any) {
    return this.blService.search("rm", "getAllRmByScroll",data);
  }

  public getAllRmByCommonArea(data:any) {
    return this.blService.search("rm", "getAllRmByCommonArea",data);
  }

}

export class SpaceUtilizationStatisticsFilterInputDTO{
    public division: boolean ;
    public department: boolean ;
    public building: boolean ;
    public floor:boolean ;
    constructor( division: boolean, department: boolean, building:boolean,floor:boolean) {
        this.division = division;
        this.department = department;
        this.building = building;
        this.floor = floor;
    }
}
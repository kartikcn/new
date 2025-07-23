export class SpaceReportFilterModel{
    public blId: number | null;
    public flId: number | null;
    public divId: number | null;
    public depId: number | null;
    public rmcatId: number | null;
    public rmtypeId : number | null;
    public teamId: number | null;
    public rmUse : string|null;
    public spaceStandard : string|null;
    public subDepId : number|null;
    constructor(blId: number | null, flId: number | null,divId: number | null,depId: number | null,rmcatId: number | null,
        rmtypeId : number | null,teamId: number | null, rmUse : string|null,spaceStandard : string|null,subDepId : number|null) {
        this.blId = blId;
        this.flId = flId;
        this.divId = divId;
        this.depId = depId;
        this.rmcatId = rmcatId;
        this.rmtypeId = rmtypeId;
        this.teamId = teamId;
        this.rmUse = rmUse;
        this.spaceStandard = spaceStandard;
        this.subDepId = subDepId;
    }
}
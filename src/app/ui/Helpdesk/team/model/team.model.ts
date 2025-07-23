export class Team {
    public teamId!: any;
    public teamType!: any;
    public description!: any;
    public teamCode!:any
    constructor(teamId: any, teamType: any, description: any,teamCode:any) {
        this.teamId = teamId;
        this.teamType = teamType;
        this.description = description;
        this.teamCode = teamCode;
    }

}

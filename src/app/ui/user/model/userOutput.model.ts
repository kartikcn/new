export class UserOutput{
        userId:number | null = null;
        userName:string="";
        emId:string="";
        userStatus:string="";
        userRoleId:number | null = null;
        deviceId:string="";
        ipAddress:string="";
        compId:number=0;
        technicianId: any;

        constructor(userId:number|NavigatorAutomationInformation,userName: String, emId: string, userStatus: string, userRoleId: number | null, deviceId: string, ipAddress: string, compId:number, technicianId: any){
                userId = userId;
                userName = userName;
                emId = emId;
                userStatus = userStatus;
                userRoleId = userRoleId;
                deviceId = deviceId;
                ipAddress = ipAddress;
                this.compId = compId;
                technicianId = technicianId;
        }
}
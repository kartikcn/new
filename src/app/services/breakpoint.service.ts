import { Injectable } from '@angular/core';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { UtilConstant as UC } from 'src/common/UtilConstant';
 
@Injectable({
    providedIn: 'root'
})
 
export class BreakpointService 
{
    private static clients : any[] = [];
    private static tabletPotrait = UC.TABLET_POTRAIT;
    private static tabletLandscape = UC.TABLET_LANDSCAPE;
    public static useTabletProtrait = false;
    public static useTabletLandscape = false;
    private static bpoSubscription:any;
 
    constructor(private bpo: BreakpointObserver)
    {
        BreakpointService.bpoSubscription = 
        this.bpo.observe([ BreakpointService.tabletPotrait, BreakpointService.tabletLandscape]).subscribe((state : BreakpointState) => { 
            BreakpointService.useTabletProtrait = state.breakpoints[BreakpointService.tabletPotrait];
            BreakpointService.useTabletLandscape = state.breakpoints[BreakpointService.tabletLandscape];
            BreakpointService.clients.forEach(client => {
                client.notify();
            });
        });
    }
 
    public register(client : any) : void
    {
        BreakpointService.clients.push(client);
        client.notify();
    }
 
    public unregister(client : any) : void
    {
        const index = BreakpointService.clients.indexOf(client, 0);
        if (index > -1)
            BreakpointService.clients.splice(index, 1);
    }
}
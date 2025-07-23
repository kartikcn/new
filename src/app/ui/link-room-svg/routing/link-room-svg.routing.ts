import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LinkRoomSvgComponent } from '../modal/link-room-svg.component';


const routes: Routes = [
    { path: '', component: LinkRoomSvgComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class LinkRoomSvgRoutingModule { }
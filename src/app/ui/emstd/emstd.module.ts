import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RoleComponent } from './role/role.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
//import { RolesRoutingModule } from './roles.routing.module';
//import { AddRoleModule } from './widget/add-role/add-role.module';
//import { RolesListComponent } from './widget/roles-list/roles-list.component';
//import { RolesListModule } from './widget/roles-list/roles-list.module';
import { EmStdRoutingModule } from './emstd-routing';
import { EmstdComponent } from './modal/emstd/emstd.component';
import { AddEmStdModule } from './widgets/add-emstd/add-emstd.module';
//import { EmstdListComponent } from './widgets/emstd-list/emstd-list.component';
import { EmStdListModule } from './widgets/emstd-list/emstd-list.module';
//import { AddEmstdComponent } from './widgets/add-emstd/add-emstd.component';



@NgModule({
  declarations: [EmstdComponent],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
    //AddRoleModule,
    AddEmStdModule,
   // RolesListModule,
    EmStdListModule,
    EmStdRoutingModule

  ],
   exports: [EmstdComponent ],
})
export class EmStdModule { }

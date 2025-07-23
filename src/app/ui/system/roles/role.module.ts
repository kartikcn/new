import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role/role.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { RolesRoutingModule } from './roles.routing.module';
import { AddRoleModule } from './widget/add-role/add-role.module';
import { RolesListComponent } from './widget/roles-list/roles-list.component';
import { RolesListModule } from './widget/roles-list/roles-list.module';



@NgModule({
  declarations: [RoleComponent],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule,
    RolesRoutingModule,
    AddRoleModule,
    RolesListModule

  ],
   exports: [RoleComponent],
})
export class RoleModule { }

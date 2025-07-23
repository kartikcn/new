import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmstdComponent } from './modal/emstd/emstd.component';

//import { RoleComponent } from './role/role.component';


const routes: Routes = [
  {path: '',component:EmstdComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmStdRoutingModule { }

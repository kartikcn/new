import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/helper/auth.guard';
//import { CostCentreComponent } from './cost-centre.component';
//import { AuthGuard } from '../../../../login/auth.guard';

// Load Routes
 const routes: Routes = [
  // { path: "", component: CostCentreComponent, canActivate:[AuthGuard]}
 ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostCentreRoutingModule { }

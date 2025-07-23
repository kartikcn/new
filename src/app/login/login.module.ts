import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login.routing.module';
import {AuthService} from 'src/app/services/auth.service';
import { MatLegacyCheckbox as MatCheckbox, MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DirectiveModule } from '../directive/directive/directive.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    NgxSpinnerModule,
    DirectiveModule
  ],
  providers:[AuthService],
  exports:[LoginComponent]
})
export class LoginModule { }

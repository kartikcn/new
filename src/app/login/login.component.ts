import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserPwdReset } from '../model/user-pwd-reset.model';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { TokenStorageService } from '../services/tokenStorage.service';
import { UsersService } from '../services/users.service';

declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;
  resetForm:UntypedFormGroup;
  submitted = false;
  returnUrl: string="";
  error:any= { errorTitle: '', errorDesc: '' };
  loginError: string="";
  isLoggedIn :boolean= false;
  isLoginFailed :boolean= false;
  title:string = 'appBootstrap';
  isPasswordResetChecked:boolean=false;
  resetMsg:string="";
  resetErrorMsg:string="";
  isEmailSent:boolean=false;
  
  closeResult: string='';
  loginFailedMsg="";

  // Declare private variables
  constructor(private fb: UntypedFormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private tokenStorage: TokenStorageService,
    private ss: SharedService,
    private userSrv:UsersService,
    private spinner: NgxSpinnerService,
    ) { 
      
      // Initialization of Reactive Form elements
    this.loginForm = this.fb.group({
      username: ['',[Validators.required,Validators.min(18)]],
      password: ['', Validators.required]
    });
    this.resetForm = this.fb.group({
      userEmail: ['', [Validators.required,Validators.email]],
      
    });
    }

  ngOnInit() {
    setTimeout(() => {
      this.ss.change(this.authService.isLoggedIn());
    });
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
      //  $('#sidebar').toggleClass('active');
      });
    });
    
      if (this.tokenStorage.getToken()) {
        this.isLoggedIn = true;
        $("#parent_body").removeClass("login_img");
        const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/index';
        this.router.navigate([redirect]);
      }else{
      $("#parent_body").addClass("login_img");
      this.router.navigate(['/login']);
      }
  }
  onSidebarClicked(){
    $('#sidebar').toggleClass('active');
  }
  onClickLink(){}

  // getting user name and password
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    // login service
    this.spinner.show();
     this.authService.login(this.username?.value,this.password?.value).subscribe((data)=>{
       this.spinner.hide();
       $("#parent_body").removeClass("login_img");
       this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
   this.router.navigate(['/welcome']);

     },error=>{
       this.spinner.hide();
       this.isLoginFailed = true;
       this.loginFailedMsg = '';
       if (error.status == 405){
        this.loginFailedMsg = "Current User is blocked. Please contact Adminstrator"
      }else{
        this.loginFailedMsg = "User name and password you entered don't match our records."
      }       
       
     });
    
  }
  passwordShow(){
		$('.textRed ,.textRed1').hide();$('#loginTenant').slideUp();$('#passwordReset').slideDown("slow");
    this.isPasswordResetChecked= true;
	}
	backLogin(){
		$('.form-group').css('margin-top', '15px');
		$('.textRed ,.textRed1,.textGreen').hide();
		$('#passwordReset').slideUp();
		$('#loginTenant').slideDown("slow");
    this.isPasswordResetChecked= false;
	}
  showPwd(){
    var $pwd = $("#pass");
		    if ($pwd.attr('type') === 'password') {
		        $pwd.attr('type', 'text');
		    } else {
		        $pwd.attr('type', 'password');
		    }
  }
  onReset(){
    this.resetErrorMsg = this.resetMsg = "";
    
    if (this.resetForm.valid){
      var userPwdDto: UserPwdReset={
        "userEmail": this.resetForm.controls["userEmail"].value,
        "url": window.origin +"/password-reset"
      };
      this.spinner.show();
      this.userSrv.resetUserCrendentials(userPwdDto).subscribe((res)=>{
          if(res != null &&  res.code == "200"){
            this.resetMsg = res.text;
            this.resetErrorMsg="";
            this.isEmailSent=true;
          }
          else if (res.status == 405){
            this.resetErrorMsg = res.text;
            this.resetMsg = "";
            this.isEmailSent = false;
          }
          else{
            this.resetErrorMsg = res.text;
            this.resetMsg="";
            this.isEmailSent=false;
            
          }
        this.spinner.hide();
      },error=>{
        this.resetErrorMsg = "Email not sent. Please contact support";
        this.resetMsg = "";
        this.isEmailSent = false;
        this.spinner.hide()
      });
    }
  }
}
import { Component } from "@angular/core";
import { TokenStorageService } from "../services/tokenStorage.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import * as CryptoJS from "crypto-js";
//import { filter } from "rxjs/operators";
import { filter } from "rxjs/operators";
import { __values } from "tslib";
//import * as CryptoJS from "crypto";
//import * as AES from "crypto";

@Component({
  selector: "app-logintrythat",
  templateUrl: "./logintrythat.component.html",
  styleUrls: ["./logintrythat.component.scss"],
})
export class LogintrythatComponent {
  TOKEN_KEY = "auth-token";
  USER_KEY = "auth-user";
  // param1: string;
  // param2: string;
  constructor(
    // private fb: UntypedFormBuilder,
    // private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorage: TokenStorageService // private ss: SharedService, // private userSrv: UsersService, // private spinner: NgxSpinnerService
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   this.param1 = params["param1"];
    //   this.param2 = params["param2"];
    // });
    // Initialization of Reactive Form elements
    // this.loginForm = this.fb.group({
    //   username: ["", [Validators.required, Validators.min(18)]],
    //   password: ["", Validators.required],
    // });
    // this.resetForm = this.fb.group({
    //   userEmail: ["", [Validators.required, Validators.email]],
    // });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log("params", params["token"]);
      let ciphertext = params["token"].split("=")[1];
      console.log("ciphertext", ciphertext);

      // let data = {
      //   token:
      //     "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ2aWtyYW50Z2lyaTI0QGdtYWlsLmNvbSIsImlhdCI6MTcxNDg5ODM3NSwiZXhwIjoxNzE0OTg0Nzc1fQ.-QlY-PHWOW9gx8n-cRxaXvikdUv65ZlFzWMnLLeJk63syNyHsDnUPKIcwkg_c0mEXDFrlZmaQhGCKeDDdfEdRw",
      //   type: "Bearer",
      //   username: "vikrantgiri24@gmail.com",
      //   userId: 45,
      //   emId: 135,
      //   userRoleId: 1,
      //   technicianId: null,
      // };

      // // Encrypt
      // var ciphertext2 = CryptoJS.AES.encrypt(
      //   JSON.stringify(data),
      //   "my-secret-key@123"
      // ).toString();
      // console.log("encrypt", ciphertext2);

      console.log("111>", ciphertext);
      //let decryptedData1 = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      let bytes = CryptoJS.AES.decrypt(ciphertext, "my-secret-key@123");
      console.log(bytes);
      let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      console.log("==>decryptedData", decryptedData);
      //let res = decryptedData;

      let res = JSON.parse(decryptedData.toString());
      console.log("==>decryptedData", res);
      // let res = decryptedData;

      //const res = true;
      if (res) {
        console.log("res======", res);
        this.tokenStorage.saveToken(res.token);
        this.tokenStorage.saveUser(res);
        //this.route.navigate;
        this.router.navigate(["welcome"]);
        // this.route.navigate(["/team/113/user/ganesh"]);
      } else {
        console.log("res not found");
      }

      //console.log("==>decryptedData", res);

      // var data = {
      //   token:
      //     "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJGTVNARk1TLkNPTSIsImlhdCI6MTcxMzk2NjUxOSwiZXhwIjoxNzE0MDUyOTE5fQ.vcF9tiYdRmfHvPxRWZTqET50RZKGYufWGYhUbPZbbZuRKhoZMQud82mt4ITynF0O8NjvipkmVnAX12JDbBQF_Q",
      //   type: "Bearer",
      //   username: "FMS@FMS.COM",
      //   userId: 11,
      //   emId: 98,
      //   userRoleId: 1,
      //   technicianId: null,
      // };
    });

    // console.log("queryParams", this.route.snapshot.queryParams);
    // let ciphertext = this.route.snapshot.queryParams.split("=")[1];
    // let bytes = CryptoJS.AES.decrypt(ciphertext, "my-secret-key@123");
    // let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log("==>decryptedData", decryptedData);
    // let res = decryptedData;

    // this.route.queryParams
    //   .pipe(filter((queryParam) => queryParam instanceof NavigationEnd))
    //   .subscribe(() => {
    //     console.log("test-==============", this.route);
    //     console.log("this.route.root", this.route.root);
    //   });
  }
  //window.sessionStorage.setItem(TOKEN_KEY, token);
}

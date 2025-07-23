import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDetailsList } from '../model/user-details-list.model';
import { UserPasswrodInputDto } from '../ui/user-profile/model/user-password.model';
import { UserProfile } from '../ui/user-profile/model/user-profile.model';
import { UserFilterInput } from '../ui/user/modal/usersFilterInput.model';
import { UserOutputDto } from '../ui/user/model/DTO/userOutputDTO.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private userService: DataService<any>,
    private userDetailService:DataService<UserDetailsList[]>
    
  ) { }

  public getUserList(data:UserFilterInput){
    return this.userService.search('user', 'users', data);
  }
  public getUserListPaginated(data:any){
    return this.userService.search('user', 'usersPaginated', data);
  }
  public getUserById(id:any){
    return this.userDetailService.getSingleById('user', 'id',id);
  }

  public getALLUsers() {
    return this.userService.getAll("user", "list");
  }

  public getALLUsersPaginated(data:any) {
    return this.userService.search("user", "listPaginated",data);
  }
  public getUserRole(){
    return this.userService.getAll("userRole","getList");
  }
  public saveUsers(item: UserOutputDto){
    return this.userService.add("user","save",item);
  }
  public validateUserName(userName:any){
    return this.userDetailService.getSingleById('user', 'check', userName);
  }
  public updateUserCrendentials(items: UserPasswrodInputDto) {
    return this.userService.update('auth', 'pwd', items);
  }
  public resetUserCrendentials(items: any) {
    return this.userService.getSingleByItem('auth', 'forgetpwd', items);
  }
  public getUserProfile(userName: any): Observable<UserProfile>{
    return this.userService.getSingleById('user','profile/get',userName);
  }
  public uploadProfilePhto(data:any){
    return this.userService.upload('doc','upload',data)
  }

  public getDocumentsById(data: any) {
    return this.userService.getSingleByItem("doc", "getDocumentsByRequest", data);
  }

  public deleteDocumentById(id: any) {
    return this.userService.getAllById("doc", "deleteDocById", id);
  }

  public uploadDocument(data: any) {
    return this.userService.upload('doc', 'uploadDocument', data)
  }
}

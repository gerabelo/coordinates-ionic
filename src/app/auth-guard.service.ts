import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  public localUser = new User();
  public loginState:boolean = false;
  public myLocation:
  {
    lat: number,
    lng: number
  }
  
  constructor() { }

  setLoginState(value: boolean) {
    this.loginState = value;
  };

  getLoginState(): boolean {
    return this.loginState;
  }

  setUser(user: User) {
    this.localUser = user;
  }

  getUser(): User {
    return this.localUser;
  }

  setLocation(value) {
    this.myLocation = value;
  }

  getLocation(): any {
    return this.myLocation;
  }
}

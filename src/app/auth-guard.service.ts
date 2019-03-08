import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  public loginState:boolean = false;
  constructor() { }

  setLoginState(value: boolean) {
    this.loginState = value;
  };

  getLoginState(): boolean {
    return this.loginState;
  }
}

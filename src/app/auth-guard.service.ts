import { Injectable } from '@angular/core';
import { User } from './user';
import { Ponto } from './ponto';
import { Type } from './type';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  public localUser = new User();
  public loginState:boolean = false;
  public Users: User[];
  public Pontos: Ponto[];
  public Tipos: Type[];
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

  getPontos(): any {
    return this.Pontos;
  }

  setPontos(value) {
    this.Pontos = value;
  }

  getUsers(): any {
    return this.Users;
  }

  setUsers(value) {
    this.Users = value;
  }

  getTipos(): any {
    return this.Tipos;
  }

  setTipos(value) {
    this.Tipos = value;
  }  
}

//https://ionicframework.com/docs/native/http/
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ponto } from './ponto';
import { User } from './user';
import { Type } from './type';

@Injectable({
  providedIn: 'root'
})
export class WsPontosService implements OnInit {

  public urlBase: string = '';

  constructor(public http: HttpClient) {
    this.urlBase = 'http://142.93.160.204';
  }

  ngOnInit() {}

  public getTypes(): Observable<Type[]> {
    let httpParams = new HttpParams();
    let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.get<Type[]>(this.urlBase+`/type/`, { headers: httpHeaders});
  }
  
  public getPontos(): Observable<Ponto[]> {
    let httpParams = new HttpParams();
    let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.get<Ponto[]>(this.urlBase+`/coordinate/`, { headers: httpHeaders});
  }

  public getPonto(id: string): Observable<Ponto>{
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<Ponto>(this.urlBase+`/coordinate`, { id });
    //this.pontos.find(ponto => ponto.id === id)
  }

  public sendPonto(ponto: Ponto) {
    var data: string;
    //let httpHeaders = new HttpHeaders({'Content-Type': 'application/json' });
    //console.log('ponto: '+JSON.stringify(ponto));
    data = JSON.stringify(ponto);
    return this.http.post<Ponto>(this.urlBase+`/coordinate/add`, ponto
    // , {
    //   headers: { 'Content-Type': 'application/json' }
    // }
    );
  }

  public login(login: string, password: string) {
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<User>(this.urlBase+`/user/login`, { login, password });
    //this.pontos.find(ponto => ponto.id === id)
  }

  public fast(id: string) {
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<User>(this.urlBase+`/user/fast`, { id });
    //this.pontos.find(ponto => ponto.id === id)
  }

  public cadastro(user: User) {
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<User>(this.urlBase+`/user/add`, { user });
    //this.pontos.find(ponto => ponto.id === id)
  }

  public debug(msg: string) {    
    let httpParams = new HttpParams();
    let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    httpParams.append("msg",msg); 
    this.http.post(this.urlBase+`/debug`,{ headers: httpHeaders, params: httpParams });
    //this.http.get(this.urlBase+`/debug?msg=`+msg);
  }

  public getUsers(): Observable<User[]> {
    let httpParams = new HttpParams();
    let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.get<User[]>(this.urlBase+`/user/`, { headers: httpHeaders});
  }  

}
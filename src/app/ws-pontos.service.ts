//https://ionicframework.com/docs/native/http/
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ponto } from './ponto';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class WsPontosService implements OnInit {

  public urlBase: string = '';

  constructor(public http: HttpClient) {
    this.urlBase = 'http://192.168.1.4:3000';
  }

  ngOnInit(){}

  public getPontos(): Observable<Ponto[]> {
    let httpParams = new HttpParams();
    let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.get<Ponto[]>(`http://192.168.1.4:3000/coordinate/`, { headers: httpHeaders});
  }

  public getPonto(id: string) {
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<Ponto>(`http://192.168.1.4:3000/coordinate`, { id });
    //this.pontos.find(ponto => ponto.id === id)
  }

  public sendCoordinate(ponto: Ponto) {
    var data: string;
    //let httpHeaders = new HttpHeaders({'Content-Type': 'application/json' });
    console.log('ponto: '+JSON.stringify(ponto));
    data = JSON.stringify(ponto);
    return this.http.post<Ponto>(`http://192.168.1.4:3000/coordinate/add`, ponto, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  public login(login: string, password: string) {
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<User>(`http://192.168.1.4:3000/user/login`, { login, password });
    //this.pontos.find(ponto => ponto.id === id)
  }

  public fast(id: string) {
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<User>(`http://192.168.1.4:3000/user/fast`, { id });
    //this.pontos.find(ponto => ponto.id === id)
  }

  public cadastro(user: User) {
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<User>(`http://192.168.1.4:3000/user/add`, { user });
    //this.pontos.find(ponto => ponto.id === id)
  }
}
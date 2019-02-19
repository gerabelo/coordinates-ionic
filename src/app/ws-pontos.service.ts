import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpClientModule } from '@angular/common/http';
//import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { Ponto } from './ponto';

@Injectable({
  providedIn: 'root'
})
export class WsPontosService implements OnInit {
  constructor(public http: HttpClient) { }

  ngOnInit(){}

  public getPontos(): Observable<Ponto[]> {
    let httpParams = new HttpParams();
    let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    return this.http.get<Ponto[]>('http://localhost:3000/coordinate/', { headers: httpHeaders});
  }

  public getPonto(id: string) {
    //let httpParams = new HttpParams();
    //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    //httpParams.append("id",id); 
    //httpParams.append("_id",id); 
    //return this.http.post<Ponto>('http://localhost:3000/coordinate/', { headers: httpHeaders, params: httpParams });
    return this.http.post<Ponto>('http://localhost:3000/coordinate', { id });
    //this.pontos.find(ponto => ponto.id === id)
  }

}
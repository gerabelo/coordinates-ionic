import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ponto } from './ponto';

@Injectable({
  providedIn: 'root'
})
export class WsPontosService implements OnInit {
  constructor(public http: HttpClient) { }

  ngOnInit(){}

  //public getPontos(): Observable<Ponto[]> {
  public getPontos(): Observable<Ponto[]> {
    return this.http.get<Ponto[]>('http://localhost:3000/coordinate/');
    // this.http.get<Ponto[]>('http://localhost:3000/coordinate/').toPromise().then(data=>{
    //   return data;
    // });
  }

  public getPonto(): Observable<Ponto> {
    let httpParams = new HttpParams();
    return this.http.post<Ponto>('http://localhost:3000/coordinate', { params: httpParams });
  }

}

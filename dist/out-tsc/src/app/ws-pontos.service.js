var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
//https://ionicframework.com/docs/native/http/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
var WsPontosService = /** @class */ (function () {
    function WsPontosService(http) {
        this.http = http;
        this.urlBase = '';
        this.urlBase = 'http://192.168.0.112:3000';
    }
    WsPontosService.prototype.ngOnInit = function () { };
    WsPontosService.prototype.getTypes = function () {
        var httpParams = new HttpParams();
        var httpHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
        return this.http.get(this.urlBase + "/type/", { headers: httpHeaders });
    };
    WsPontosService.prototype.getPontos = function () {
        var httpParams = new HttpParams();
        var httpHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
        return this.http.get(this.urlBase + "/coordinate/", { headers: httpHeaders });
    };
    WsPontosService.prototype.getPonto = function (id) {
        //let httpParams = new HttpParams();
        //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
        //httpParams.append("id",id); 
        //httpParams.append("_id",id); 
        //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
        return this.http.post(this.urlBase + "/coordinate", { id: id });
        //this.pontos.find(ponto => ponto.id === id)
    };
    WsPontosService.prototype.sendPonto = function (ponto) {
        var data;
        //let httpHeaders = new HttpHeaders({'Content-Type': 'application/json' });
        //console.log('ponto: '+JSON.stringify(ponto));
        data = JSON.stringify(ponto);
        return this.http.post(this.urlBase + "/coordinate/add", ponto
        // , {
        //   headers: { 'Content-Type': 'application/json' }
        // }
        );
    };
    WsPontosService.prototype.login = function (login, password) {
        //let httpParams = new HttpParams();
        //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
        //httpParams.append("id",id); 
        //httpParams.append("_id",id); 
        //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
        return this.http.post(this.urlBase + "/user/login", { login: login, password: password });
        //this.pontos.find(ponto => ponto.id === id)
    };
    WsPontosService.prototype.fast = function (id) {
        //let httpParams = new HttpParams();
        //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
        //httpParams.append("id",id); 
        //httpParams.append("_id",id); 
        //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
        return this.http.post(this.urlBase + "/user/fast", { id: id });
        //this.pontos.find(ponto => ponto.id === id)
    };
    WsPontosService.prototype.cadastro = function (user) {
        //let httpParams = new HttpParams();
        //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
        //httpParams.append("id",id); 
        //httpParams.append("_id",id); 
        //return this.http.post<Ponto>('http://192.168.1.4:3000/coordinate/', { headers: httpHeaders, params: httpParams });
        return this.http.post(this.urlBase + "/user/add", { user: user });
        //this.pontos.find(ponto => ponto.id === id)
    };
    WsPontosService.prototype.debug = function (msg) {
        var httpParams = new HttpParams();
        var httpHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
        httpParams.append("msg", msg);
        this.http.post(this.urlBase + "/debug", { headers: httpHeaders, params: httpParams });
        //this.http.get(this.urlBase+`/debug?msg=`+msg);
    };
    WsPontosService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], WsPontosService);
    return WsPontosService;
}());
export { WsPontosService };
//# sourceMappingURL=ws-pontos.service.js.map
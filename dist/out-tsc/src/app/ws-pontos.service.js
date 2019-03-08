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
    }
    WsPontosService.prototype.ngOnInit = function () { };
    WsPontosService.prototype.getPontos = function () {
        var httpParams = new HttpParams();
        var httpHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
        return this.http.get('http://localhost:3000/coordinate/', { headers: httpHeaders });
    };
    WsPontosService.prototype.getPonto = function (id) {
        //let httpParams = new HttpParams();
        //let httpHeaders = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
        //httpParams.append("id",id); 
        //httpParams.append("_id",id); 
        //return this.http.post<Ponto>('http://localhost:3000/coordinate/', { headers: httpHeaders, params: httpParams });
        return this.http.post('http://localhost:3000/coordinate', { id: id });
        //this.pontos.find(ponto => ponto.id === id)
    };
    WsPontosService.prototype.sendCoordinate = function (ponto) {
        var data;
        //let httpHeaders = new HttpHeaders({'Content-Type': 'application/json' });
        console.log('ponto: ' + JSON.stringify(ponto));
        data = JSON.stringify(ponto);
        return this.http.post('http://localhost:3000/coordinate/add', ponto, {
            headers: { 'Content-Type': 'application/json' }
        });
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
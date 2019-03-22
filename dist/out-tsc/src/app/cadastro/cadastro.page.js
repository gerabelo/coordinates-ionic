var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { User } from '../user';
import { WsPontosService } from '../ws-pontos.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NavController } from '@ionic/angular';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop, faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthGuardService } from '../auth-guard.service';
import { Storage } from '@ionic/storage';
var CadastroPage = /** @class */ (function () {
    function CadastroPage(navCtrl, wspontos, storage, global) {
        this.navCtrl = navCtrl;
        this.wspontos = wspontos;
        this.storage = storage;
        this.global = global;
        this.newUser = new User();
        //public newUser = this.global.getUser;
        this.faCompass = faCompass;
        this.faInfoCircle = faInfoCircle;
        this.faChevronCircleLeft = faChevronCircleLeft;
        this.faMapMarker = faMapMarker;
        this.faPhone = faPhone;
        this.faRecycle = faRecycle;
        this.faDesktop = faDesktop;
        this.faBars = faBars;
    }
    CadastroPage.prototype.ngOnInit = function () {
        this.newUser.status = "1";
    };
    CadastroPage.prototype.cadastro = function () {
        var _this = this;
        var password = String(this.newUser.password);
        this.newUser.password = String(Md5.hashStr(password));
        console.log(JSON.stringify(this.newUser));
        this.wspontos.cadastro(this.newUser).subscribe(function (data) {
            if (data == null) {
                location.reload();
            }
            else {
                _this.global.setUser(_this.newUser);
                _this.storage.set('cico', _this.newUser);
                _this.navCtrl.navigateForward('/mapa');
            }
        });
    };
    CadastroPage = __decorate([
        Component({
            selector: 'app-cadastro',
            templateUrl: './cadastro.page.html',
            styleUrls: ['./cadastro.page.scss'],
        }),
        __metadata("design:paramtypes", [NavController,
            WsPontosService,
            Storage,
            AuthGuardService])
    ], CadastroPage);
    return CadastroPage;
}());
export { CadastroPage };
//# sourceMappingURL=cadastro.page.js.map
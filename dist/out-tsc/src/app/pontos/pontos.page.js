var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { NavController, PopoverController, AlertController } from '@ionic/angular';
import { faCompass, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PopoverComponent } from '../popover/popover.component';
import { Storage } from '@ionic/storage';
var PontosPage = /** @class */ (function () {
    // myLatLng: {
    //   lat: number,
    //   lng: number
    // }
    // myLatLng = null;
    function PontosPage(wspontos, navCtrl, geolocation, popoverCtrl, alertCtrl, storage) {
        this.wspontos = wspontos;
        this.navCtrl = navCtrl;
        this.geolocation = geolocation;
        this.popoverCtrl = popoverCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.pontos = [];
        this.tipos = [];
        this.pts = [];
        this.distances = [];
        this.faCompass = faCompass;
        this.faInfoCircle = faInfoCircle;
    }
    PontosPage.prototype.ngOnInit = function () {
        var _this = this;
        this.wspontos.getTypes().subscribe(function (types) {
            types.forEach(function (type) {
                _this.tipos.push(type);
            });
        });
        this.wspontos.getPontos().subscribe(function (data) {
            _this.pontos = data;
            if (_this.pontos.length) {
                var p1 = new Promise(function (resolve, reject) {
                    var myLatLng = _this.getLocation();
                    resolve(myLatLng);
                });
                p1.then(function (value) {
                    _this.pontos.forEach(function (ponto) {
                        var p2 = new Promise(function (sucess, fail) {
                            sucess(_this.geodesicDistance(+ponto.lat, +ponto.lng, +value.lat, +value.lng));
                        });
                        p2.then(function (result) {
                            console.log("value:" + result);
                            if (+result > 1000) {
                                var d = new Intl.NumberFormat('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format((+result / 1000));
                                _this.distances.push(d + 'k');
                            }
                            else {
                                var d = new Intl.NumberFormat('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(+result);
                                _this.distances.push(d);
                            }
                        });
                    });
                });
            }
            else {
                _this.alertNoEntries();
            }
            _this.pontos.forEach(function (ponto) {
                var tipo = _this.tipos.find(function (x) { return x._id == ponto.typeId; });
                var lat = +ponto.lat, lng = +ponto.lng, id = ponto._id, description = tipo.description, icon = tipo.icon;
                _this.pts.push({ lat: lat, lng: lng, id: id, description: description, icon: icon });
                // console.log('ponto.id: '+ponto._id);
            });
        });
    };
    PontosPage.prototype.getPonto = function (id) {
        this.navCtrl.navigateForward('/ponto/' + id);
    };
    PontosPage.prototype.geodesicDistance = function (lat1, lng1, lat2, lng2) {
        // console.log("lat lng: "+lat1+" "+lng1);
        var R = 6371000; // metres
        var φ1 = this.toRad(lat1);
        var φ2 = this.toRad(+lat2);
        var Δφ = Math.sqrt(Math.pow(this.toRad(+lat2) - this.toRad(lat1), 2));
        var Δλ = Math.sqrt(Math.pow(this.toRad(+lng2) - this.toRad(lng1), 2));
        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = (R * c).toFixed(1);
        // console.log("φ1: "+φ1);
        // console.log("φ2: "+φ2);
        // console.log("Δφ: "+Δφ);
        // console.log("Δλ: "+Δλ);
        // console.log("c: "+c);
        return d;
    };
    PontosPage.prototype.toRad = function (value) {
        return value * Math.PI / 180;
    };
    PontosPage.prototype.goToMapa = function () {
        this.navCtrl.navigateForward('/mapa');
    };
    PontosPage.prototype.goToAbout = function () {
        this.navCtrl.navigateForward('/about');
    };
    PontosPage.prototype.getLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.geolocation.getCurrentPosition()];
                    case 1:
                        rta = _a.sent();
                        return [2 /*return*/, {
                                lat: rta.coords.latitude,
                                lng: rta.coords.longitude
                            }];
                }
            });
        });
    };
    // async loadPosition() {
    //   this.myLatLng = await this.getLocation();
    // }
    PontosPage.prototype.presentPopover = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverCtrl.create({
                            component: PopoverComponent,
                            event: ev,
                            translucent: true,
                            cssClass: 'custom-popover'
                        })];
                    case 1:
                        popover = _a.sent();
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PontosPage.prototype.alertNoEntries = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: "Aten\u00E7\u00E3o",
                            message: "<p class='alert'><b>N\u00E3o h\u00E1 pontos para exibir!</p>",
                            buttons: [
                                {
                                    text: 'Ok',
                                    role: 'cancel',
                                    cssClass: 'alert-cancel',
                                    handler: function () {
                                        console.log('Cancel clicked');
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert2 = _a.sent();
                        return [4 /*yield*/, alert2.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PontosPage = __decorate([
        Component({
            selector: 'app-pontos',
            templateUrl: './pontos.page.html',
            styleUrls: ['./pontos.page.scss'],
        }),
        __metadata("design:paramtypes", [WsPontosService,
            NavController,
            Geolocation,
            PopoverController,
            AlertController,
            Storage])
    ], PontosPage);
    return PontosPage;
}());
export { PontosPage };
//# sourceMappingURL=pontos.page.js.map
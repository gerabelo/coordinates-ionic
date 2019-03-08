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
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, PopoverController } from '@ionic/angular';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop, faBars } from '@fortawesome/free-solid-svg-icons';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { NavController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { AlertController } from '@ionic/angular';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AuthGuardService } from '../auth-guard.service';
var MapaPage = /** @class */ (function () {
    function MapaPage(geolocation, loadingCtrl, wspontos, navCtrl, popoverCtrl, alertCtrl, nativeGeocoder, authGuard) {
        this.geolocation = geolocation;
        this.loadingCtrl = loadingCtrl;
        this.wspontos = wspontos;
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.alertCtrl = alertCtrl;
        this.nativeGeocoder = nativeGeocoder;
        this.authGuard = authGuard;
        this.pontos = [];
        this.faCompass = faCompass;
        this.faInfoCircle = faInfoCircle;
        this.faChevronCircleLeft = faChevronCircleLeft;
        this.faMapMarker = faMapMarker;
        this.faPhone = faPhone;
        this.faRecycle = faRecycle;
        this.faDesktop = faDesktop;
        this.faBars = faBars;
        this.logado = false;
        this.mapRef = null;
        this.myLatLng = null;
        this.myMark = null;
        // myLatLng: {
        //   lat: number,
        //   lng: number
        // }
        this.options = {
            useLocale: true,
            maxResults: 5
        };
    }
    MapaPage.prototype.ngOnInit = function () {
        var _this = this;
        !this.authGuard.loginState ? this.login() : null;
        this.wspontos.getPontos().subscribe(function (data) {
            _this.pontos = data;
        });
        this.loadMap();
    };
    MapaPage.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alertLogin;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            backdropDismiss: false,
                            // header: `Identifique-se`,
                            message: "<p class='alert'><b>Identifique-se!</p>",
                            inputs: [
                                {
                                    name: 'login',
                                    // label: 'user',
                                    placeholder: 'user',
                                    type: 'text'
                                },
                                {
                                    name: 'password',
                                    // label: 'password',
                                    placeholder: 'password',
                                    type: 'password'
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel',
                                    cssClass: 'alert-cancel',
                                    handler: function () {
                                        _this.authGuard.setLoginState(false);
                                        _this.login();
                                    }
                                },
                                {
                                    text: 'Login',
                                    cssClass: 'alert-ok',
                                    handler: function (data) {
                                        if (data.login === 'root' && data.password === '123456') {
                                            _this.authGuard.setLoginState(true);
                                        }
                                        else {
                                            _this.authGuard.setLoginState(false);
                                            _this.login();
                                        }
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alertLogin = _a.sent();
                        return [4 /*yield*/, alertLogin.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MapaPage.prototype.loadMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loading, _a, mapEle;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadingCtrl.create()];
                    case 1:
                        loading = _b.sent();
                        loading.present();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 5]);
                        _a = this;
                        return [4 /*yield*/, this.getLocation()];
                    case 3:
                        _a.myLatLng = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        mapEle = document.getElementById('map');
                        this.mapRef = new google.maps.Map(mapEle, {
                            center: this.myLatLng,
                            zoom: 15
                        });
                        return [7 /*endfinally*/];
                    case 5:
                        google.maps.event
                            .addListenerOnce(this.mapRef, 'idle', function () {
                            loading.dismiss();
                            if (_this.pontos.length) {
                                _this.pontos.forEach(function (ponto) {
                                    _this.addInfoWindow(_this.mapRef, 
                                    //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
                                    _this.addMaker(+ponto.lat, +ponto.lng, null, ponto.type.icon, false), 
                                    // '<div id="infoWindow-'+ponto.type.id+'">'+
                                    '<div id="content">' +
                                        '<div id="siteNotice">' +
                                        '</div>' +
                                        '<h1 id="firstHeading" class="firstHeading">' + ponto.description + '</h1>' +
                                        '<div id="bodyContent">' +
                                        '<p>' + ponto.address + '</br>' +
                                        ponto.phone + '</br>' +
                                        _this.geodesicDistance(+ponto.lat, +ponto.lng) + 'm</p>' +
                                        '</div>' +
                                        '</div>');
                                });
                            }
                            _this.myMark = _this.addMaker(_this.myLatLng.lat, _this.myLatLng.lng, null, "assets/icon/mylocation.png", true);
                            _this.pickUp(_this.myMark);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MapaPage.prototype.addInfoWindow = function (map, marker, contentString) {
        var infoWindow = new google.maps.InfoWindow({
            content: contentString
        });
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });
    };
    MapaPage.prototype.addMaker = function (lat, lng, lbl, ico, drag) {
        //https://developers.google.com/maps/documentation/javascript/markers
        //https://developers.google.com/maps/documentation/javascript/distancematrix
        //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
        //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        var marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: this.mapRef,
            label: lbl,
            icon: ico,
            animation: google.maps.Animation.DROP,
            draggable: drag
        });
        return marker;
    };
    MapaPage.prototype.getLocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.geolocation.getCurrentPosition({ timeout: 30000, enableHighAccuracy: true })];
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
    MapaPage.prototype.geodesicDistance = function (lat, lng) {
        var R = 6371000; // metres
        var φ1 = this.toRad(lat);
        var φ2 = this.toRad(+this.myLatLng.lat);
        var Δφ = Math.sqrt(Math.pow(this.toRad(+this.myLatLng.lat) - this.toRad(lat), 2));
        var Δλ = Math.sqrt(Math.pow(this.toRad(+this.myLatLng.lng) - this.toRad(lng), 2));
        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = (R * c).toFixed(1);
        return d;
    };
    MapaPage.prototype.toRad = function (value) {
        return value * Math.PI / 180;
    };
    MapaPage.prototype.goToList = function () {
        this.navCtrl.navigateForward('/pontos');
    };
    MapaPage.prototype.goToAbout = function () {
        this.navCtrl.navigateForward('/about');
    };
    MapaPage.prototype.presentPopover = function (ev) {
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
    MapaPage.prototype.pickUp = function (marker) {
        var _this = this;
        var lat;
        var lng;
        google.maps.event.addListener(marker, 'dragend', function () {
            lat = marker.position.lat();
            lng = marker.position.lng();
            _this.sendPointConfirm(lat, lng);
        });
    };
    MapaPage.prototype.sendPointConfirm = function (lat, lng) {
        return __awaiter(this, void 0, void 0, function () {
            var endereco, alertNovoPonto;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.nativeGeocoder.reverseGeocode(lat, lng, this.options)
                            .then(function (result) {
                            endereco = JSON.stringify(result[0]);
                            console.log(JSON.stringify(result[0]));
                        })
                            .catch(function (error) { return console.log("error: " + error); });
                        console.log('endereco: ' + endereco);
                        return [4 /*yield*/, this.alertCtrl.create({
                                //header: '[Novo Ponto]',
                                message: "<p class='alert'><b>[Novo Ponto]</br></br>lat:</b> " + lat + "</br><b>lng:</b> " + lng + "</p>",
                                inputs: [
                                    {
                                        name: 'description',
                                        placeholder: 'descrição',
                                        type: 'text'
                                    },
                                    {
                                        name: 'phone',
                                        placeholder: 'contato',
                                        type: 'text'
                                    },
                                    {
                                        name: 'address',
                                        placeholder: 'endereço',
                                        type: 'text'
                                    },
                                    {
                                        name: 'website',
                                        type: 'url',
                                        placeholder: 'website'
                                    }
                                ],
                                buttons: [
                                    {
                                        text: 'Cancelar',
                                        role: 'cancel',
                                        cssClass: 'alert-cancel',
                                        handler: function () {
                                            console.log('Cancel clicked');
                                        }
                                    },
                                    {
                                        text: 'Proximo',
                                        cssClass: 'alert-ok',
                                        handler: function (data) { return __awaiter(_this, void 0, void 0, function () {
                                            var status, alertTipo;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        console.log('Send clicked');
                                                        status = 0;
                                                        return [4 /*yield*/, this.alertCtrl.create({
                                                                message: "<p class='alert'><b>Informe o Tipo</p>",
                                                                inputs: [
                                                                    {
                                                                        name: 'type',
                                                                        label: 'Blue',
                                                                        value: { id: '001', icon: 'assets/icon/recycleBlueMarker.png' },
                                                                        type: 'radio',
                                                                        checked: true
                                                                    },
                                                                    {
                                                                        name: 'type',
                                                                        label: 'Green',
                                                                        value: { id: '002', icon: 'assets/icon/recycleGreenMarker.png' },
                                                                        type: 'radio',
                                                                    },
                                                                    {
                                                                        name: 'type',
                                                                        label: 'Red',
                                                                        value: { id: '003', icon: 'assets/icon/recycleRedMarker.png' },
                                                                        type: 'radio',
                                                                    }
                                                                ],
                                                                buttons: [
                                                                    {
                                                                        text: 'Cancelar',
                                                                        role: 'cancel',
                                                                        cssClass: 'alert-cancel',
                                                                        handler: function () {
                                                                            console.log('Cancel clicked');
                                                                        }
                                                                    },
                                                                    {
                                                                        text: 'Enviar',
                                                                        cssClass: 'alert-ok',
                                                                        handler: function (res) {
                                                                            console.log("res: " + JSON.stringify(res));
                                                                            //checkbox requires res[0].icon
                                                                            var ponto = new Ponto(null, data.description, data.phone, data.address, lat, lng, status, res, data.website);
                                                                            _this.wspontos.sendCoordinate(ponto).subscribe(function (result) {
                                                                                console.log('result: ' + JSON.stringify(result));
                                                                            });
                                                                            //window.location.reload();
                                                                            _this.myMark.setMap(null);
                                                                            _this.addInfoWindow(_this.mapRef, 
                                                                            //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
                                                                            _this.addMaker(+ponto.lat, +ponto.lng, null, res.icon, false), '<div id="content">' +
                                                                                '<div id="siteNotice">' +
                                                                                '</div>' +
                                                                                '<h1 id="firstHeading" class="firstHeading">' + ponto.description + '</h1>' +
                                                                                '<div id="bodyContent">' +
                                                                                '<p>' + ponto.address + '</p>' +
                                                                                '<p>' + ponto.phone + '</p>' +
                                                                                '<p>' + _this.geodesicDistance(+ponto.lat, +ponto.lng) + ' m</p>' +
                                                                                '</div>' +
                                                                                '</div>');
                                                                            _this.myMark = _this.addMaker(_this.myLatLng.lat, _this.myLatLng.lng, null, "assets/icon/mylocation.png", true);
                                                                            _this.pickUp(_this.myMark);
                                                                        }
                                                                    }
                                                                ]
                                                            })];
                                                    case 1:
                                                        alertTipo = _a.sent();
                                                        return [4 /*yield*/, alertTipo.present()];
                                                    case 2: return [2 /*return*/, _a.sent()];
                                                }
                                            });
                                        }); }
                                    }
                                ]
                            })];
                    case 1:
                        alertNovoPonto = _a.sent();
                        return [4 /*yield*/, alertNovoPonto.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MapaPage = __decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'mapa.page.html',
            styleUrls: ['mapa.page.scss'],
        }),
        __metadata("design:paramtypes", [Geolocation,
            LoadingController,
            WsPontosService,
            NavController,
            PopoverController,
            AlertController,
            NativeGeocoder,
            AuthGuardService])
    ], MapaPage);
    return MapaPage;
}());
export { MapaPage };
//# sourceMappingURL=mapa.page.js.map
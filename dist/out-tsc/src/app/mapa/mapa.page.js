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
import { NavController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { AlertController } from '@ionic/angular';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Storage } from '@ionic/storage';
import { AuthGuardService } from '../auth-guard.service';
import { filter } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { ModalSendPointPage } from '../modal-send-point/modal-send-point.page';
var MapaPage = /** @class */ (function () {
    function MapaPage(geolocation, loadingCtrl, wspontos, navCtrl, popoverCtrl, alertCtrl, nativeGeocoder, storage, global, modal) {
        this.geolocation = geolocation;
        this.loadingCtrl = loadingCtrl;
        this.wspontos = wspontos;
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.alertCtrl = alertCtrl;
        this.nativeGeocoder = nativeGeocoder;
        this.storage = storage;
        this.global = global;
        this.modal = modal;
        this.pontos = [];
        this.tipos = [];
        this.faCompass = faCompass;
        this.faInfoCircle = faInfoCircle;
        this.faChevronCircleLeft = faChevronCircleLeft;
        this.faMapMarker = faMapMarker;
        this.faPhone = faPhone;
        this.faRecycle = faRecycle;
        this.faDesktop = faDesktop;
        this.faBars = faBars;
        this.mapRef = null;
        this.myLatLng = null;
        this.myMark = null;
        this.options = {
            useLocale: true,
            maxResults: 5
        };
    }
    // ionViewDidEnter() {
    //  ionViewDidLoad() {
    MapaPage.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.getLocalData().then(function (value) {
            console.log('cico: ', value);
            if (value == null) {
                _this.user = null;
                _this.global.setUser(null);
                _this.login();
            }
            else {
                // this.wspontos.fast(value.id).subscribe(usuario => {
                //   this.user = usuario;
                // })
                _this.user = JSON.parse(value);
                _this.global.setUser(JSON.parse(value));
            }
        }).catch(function (err) {
            _this.login();
        });
    };
    MapaPage.prototype.ngOnInit = function () {
        var _this = this;
        this.wspontos.getPontos().subscribe(function (data) {
            _this.pontos = data;
        });
        this.wspontos.getTypes().subscribe(function (types) {
            _this.tipos = types;
        });
        //             this.tipos = types;
        //this.loadMap_old();
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
                            // header: `Login`,
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
                                    text: 'Cadastrar',
                                    role: 'cancel',
                                    cssClass: 'alert-cancel',
                                    handler: function () {
                                        _this.navCtrl.navigateForward('/cadastro');
                                    }
                                },
                                {
                                    text: 'Login',
                                    handler: function (data) {
                                        console.log("login e pass: " + data.login + " " + data.password);
                                        _this.wspontos.login(data.login, data.password).subscribe(function (usuario) {
                                            console.log('usuario: ' + JSON.stringify(usuario));
                                            if (usuario == null) {
                                                _this.user = null;
                                                _this.global.setUser(null);
                                                _this.login();
                                            }
                                            else {
                                                _this.setLocalData(JSON.stringify(usuario));
                                                _this.getLocalData().then(function (value) {
                                                    console.log('cico: ', value);
                                                });
                                                _this.user = usuario;
                                                _this.global.setUser(usuario);
                                            }
                                        });
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
            var loading, watchOptions, watchID;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingCtrl.create()];
                    case 1:
                        loading = _a.sent();
                        loading.present();
                        watchOptions = {
                            timeout: 30000,
                            maxAge: 0,
                            enableHighAccuracy: true
                        };
                        watchID = navigator.geolocation.watchPosition(function (position) {
                            ///
                            if (position.coords != undefined) {
                                var geoposition = position;
                                console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
                            }
                            _this.setLatLng(geoposition.coords.latitude, geoposition.coords.longitude);
                            var mapEle = document.getElementById('map');
                            _this.mapRef = new google.maps.Map(mapEle, {
                                center: { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude },
                                zoom: 15
                            });
                            google.maps.event.addListenerOnce(_this.mapRef, 'idle', function () {
                                loading.dismiss();
                                if (_this.pontos.length) {
                                    _this.pontos.forEach(function (ponto) {
                                        console.log("ponto: " + JSON.stringify(ponto));
                                        var type = _this.tipos.find(function (x) { return x._id == ponto.typeId; });
                                        // this.tipos.forEach(tipo => {
                                        //   if (ponto.typeId === tipo._id) {
                                        //     type = tipo;
                                        //     console.log("type.icon: "+type.icon);
                                        //   }
                                        // });
                                        // console.log("ponto.typeId: "+type.icon);
                                        _this.addInfoWindow(_this.mapRef, _this.addMaker(+ponto.lat, +ponto.lng, null, type.icon, false), 
                                        // '<div id="infoWindow-'+ponto.type.id+'">'+
                                        '<div id="content">' +
                                            '<div id="siteNotice">' +
                                            '</div>' +
                                            '<h1 id="firstHeading" class="firstHeading">' + type.description + '</h1>' +
                                            '<div id="bodyContent">' +
                                            _this.geodesicDistance(+ponto.lat, +ponto.lng) + 'm</p>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>');
                                    });
                                }
                                console.log('lat: ' + _this.lat + ' lng: ' + _this.lng);
                                _this.myMark = _this.addMaker(_this.lat, _this.lng, null, "assets/icon/mylocation.png", true);
                                _this.pickUp(_this.myMark);
                            });
                            ///
                            navigator.geolocation.clearWatch(watchID);
                        }, null, { enableHighAccuracy: true });
                        return [2 /*return*/];
                }
            });
        });
    };
    // async loadMap_new() {
    //   //watchPosition sem clearWatch
    //   const loading = await this.loadingCtrl.create();
    //   loading.present();
    //   let watchOptions = {
    //     timeout : 30000,
    //     maxAge: 0,
    //     enableHighAccuracy: true
    //   };
    //   var watch = this.geolocation.watchPosition(watchOptions)
    //   .pipe(filter((p) => p.coords !== undefined)) //Filter Out Errors
    //   .subscribe((data) => {
    //     if ((data as Geoposition).coords != undefined) {
    //       var geoposition = (data as Geoposition);
    //       //this.myLatLng = { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude }
    //       console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
    //     }
    //     this.setLatLng(geoposition.coords.latitude,geoposition.coords.longitude);
    //     // console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
    //     const mapEle: HTMLElement = document.getElementById('map');
    //     this.mapRef = new google.maps.Map(mapEle, {
    //       center: {lat: geoposition.coords.latitude, lng: geoposition.coords.longitude},
    //       zoom: 15
    //     });
    //     google.maps.event
    //     .addListenerOnce(this.mapRef, 'idle', () => {
    //       loading.dismiss();
    //       if (this.pontos.length) {
    //         this.pontos.forEach(ponto => {
    //           var type: Type;
    //           this.tipos.forEach(tipo => {
    //             if (ponto.typeId === tipo._id) {
    //               type = tipo;
    //             }
    //           });
    //           this.addInfoWindow(
    //             this.mapRef,
    //             //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
    //             this.addMaker(+ponto.lat,+ponto.lng,null,type.icon,false),
    //             // '<div id="infoWindow-'+ponto.type.id+'">'+
    //             '<div id="content">'+
    //               '<div id="siteNotice">'+
    //               '</div>'+
    //               '<h1 id="firstHeading" class="firstHeading">'+type.description+'</h1>'+
    //               '<div id="bodyContent">'+
    //                 this.geodesicDistance(+ponto.lat,+ponto.lng)+'m</p>'+
    //               '</div>'+
    //               '<div id="tap">adicionar fotos</div>'+
    //               '</div>'
    //             );
    //           });
    //         }      
    //         console.log('lat: '+this.lat+' lng: '+this.lng);
    //         this.myMark = this.addMaker(this.lat, this.lng,null,"assets/icon/mylocation.png",true);
    //         this.pickUp(this.myMark);
    //       });
    //     });
    // }
    // async loadMap_old() {
    //   //faz uso da versao antiga da getLocation que, por sua vez, utiliza GetCurrentPosition ao invés de WatchPosition
    //   const loading = await this.loadingCtrl.create();
    //   loading.present();
    //   try {
    //     this.myLatLng = await this.getLocation_old();
    //   } finally {
    //     const mapEle: HTMLElement = document.getElementById('map');
    //     this.mapRef = new google.maps.Map(mapEle, {
    //       center: this.myLatLng,
    //       zoom: 15
    //     });      
    //   }
    //   google.maps.event
    //   .addListenerOnce(this.mapRef, 'idle', () => {
    //     loading.dismiss();
    //     if (this.pontos.length) {
    //       this.pontos.forEach(ponto => {
    //         var type: Type;
    //           this.tipos.forEach(tipo => {
    //             if (ponto.typeId === tipo._id) {
    //               type = tipo;
    //             }
    //           });
    //         this.addInfoWindow(
    //           this.mapRef,
    //           //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
    //           this.addMaker(+ponto.lat,+ponto.lng,null,type.icon,false),
    //           // '<div id="infoWindow-'+ponto.type.id+'">'+
    //           '<div id="content">'+
    //             '<div id="siteNotice">'+
    //             '</div>'+
    //             '<h1 id="firstHeading" class="firstHeading">'+type.description+'</h1>'+
    //             '<div id="bodyContent">'+
    //               this.geodesicDistance(+ponto.lat,+ponto.lng)+'m</p>'+
    //             '</div>'+
    //             '<div id="tap">adicionar fotos</div>'+
    //           '</div>'
    //         );
    //       });
    //     }      
    //     this.myMark = this.addMaker(this.myLatLng.lat, this.myLatLng.lng,null,"assets/icon/mylocation.png",true);
    //     this.pickUp(this.myMark);
    //   });
    // }
    MapaPage.prototype.addInfoWindow = function (map, marker, contentString) {
        var infoWindow = new google.maps.InfoWindow({
            content: contentString
        });
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
            google.maps.event.addListenerOnce(infoWindow, 'domready', function () {
                document.getElementById('tap').addEventListener('click', function () {
                    alert('Clicked');
                    //this.addPicture();
                    console.log("touch");
                    //this.closeInfoViewWindow(infoWindow);
                    //this.openEventDetailModal(event);
                });
            });
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
            var loading, watchOptions, watch;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingCtrl.create()];
                    case 1:
                        loading = _a.sent();
                        loading.present();
                        watchOptions = {
                            timeout: 30000,
                            maxAge: 0,
                            enableHighAccuracy: true
                        };
                        watch = this.geolocation.watchPosition(watchOptions)
                            .pipe(filter(function (p) { return p.coords !== undefined; })) //Filter Out Errors
                            .subscribe(function (data) {
                            if (data.coords != undefined) {
                                var geoposition = data;
                                //this.myLatLng = { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude }
                                console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
                            }
                            _this.setLatLng(geoposition.coords.latitude, geoposition.coords.longitude);
                            _this.myLatLng = { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude };
                            _this.lat = geoposition.coords.latitude;
                            _this.lng = geoposition.coords.longitude;
                            // console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
                            var mapEle = document.getElementById('map');
                            _this.mapRef = new google.maps.Map(mapEle, {
                                center: { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude },
                                zoom: 15
                            });
                            google.maps.event
                                .addListenerOnce(_this.mapRef, 'idle', function () {
                                loading.dismiss();
                                if (_this.pontos.length) {
                                    _this.pontos.forEach(function (ponto) {
                                        var type;
                                        _this.tipos.forEach(function (tipo) {
                                            if (ponto.typeId === tipo._id) {
                                                type = tipo;
                                            }
                                        });
                                        _this.addInfoWindow(_this.mapRef, 
                                        //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
                                        _this.addMaker(+ponto.lat, +ponto.lng, null, type.icon, false), 
                                        // '<div id="infoWindow-'+ponto.type.id+'">'+
                                        '<div id="content">' +
                                            '<div id="siteNotice">' +
                                            '</div>' +
                                            '<h1 id="firstHeading" class="firstHeading">' + type.description + '</h1>' +
                                            '<div id="bodyContent">' +
                                            _this.geodesicDistance(+ponto.lat, +ponto.lng) + 'm</p>' +
                                            '</div>' +
                                            '</div>');
                                    });
                                }
                                console.log('lat: ' + _this.lat + ' lng: ' + _this.lng);
                                _this.myMark = _this.addMaker(_this.lat, _this.lng, null, "assets/icon/mylocation.png", true);
                                _this.pickUp(_this.myMark);
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MapaPage.prototype.geodesicDistance = function (lat, lng) {
        var R = 6371000; // metres
        var φ1 = this.toRad(lat);
        // var φ2 = this.toRad(+this.myLatLng.lat);
        var φ2 = this.toRad(+this.lat);
        // var Δφ = Math.sqrt(Math.pow(this.toRad(+this.myLatLng.lat)-this.toRad(lat),2));
        // var Δλ = Math.sqrt(Math.pow(this.toRad(+this.myLatLng.lng)-this.toRad(lng),2));
        var Δφ = Math.sqrt(Math.pow(this.toRad(+this.lat) - this.toRad(lat), 2));
        var Δλ = Math.sqrt(Math.pow(this.toRad(+this.lng) - this.toRad(lng), 2));
        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = (R * c).toFixed(1);
        return new Intl.NumberFormat('pt-br', { minimumFractionDigits: 2 }).format(+d);
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
            var SendPoint;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //https://ionicframework.com/docs/v3/3.3.0/api/components/alert/AlertController/    
                        //https://ionicframework.com/docs/native/native-geocoder/
                        this.nativeGeocoder.reverseGeocode(lat, lng, this.options)
                            .then(function (result) {
                            console.log(JSON.stringify(result[0]));
                        }).catch(function (error) {
                            console.log(error);
                        });
                        return [4 /*yield*/, this.modal.create({
                                component: ModalSendPointPage,
                                componentProps: { position: { lat: lat, lng: lng } }
                            })];
                    case 1:
                        SendPoint = _a.sent();
                        SendPoint.onDidDismiss().then(function (typeId) { return __awaiter(_this, void 0, void 0, function () {
                            var type;
                            return __generator(this, function (_a) {
                                type = this.tipos.find(function (x) { return x._id == typeId.data; });
                                // const alertType = await this.alertCtrl.create({  
                                //   message: `<p><b>`+typeId['data']+`</p>`
                                // });
                                // return await alertType.present();
                                this.myMark.setMap(null);
                                this.addInfoWindow(this.mapRef, this.addMaker(+lat, +lng, type.description, type.icon, false), 
                                // this.addMaker(+lat,+lng,null,res.icon,false),
                                '<div id="content">' +
                                    '<div id="siteNotice">' +
                                    '</div>' +
                                    '<h1 id="firstHeading" class="firstHeading">' + type.description + '</h1>' +
                                    '<div id="bodyContent">' +
                                    '<p>' + this.geodesicDistance(+lat, +lng) + ' m</p>' +
                                    '</div>' +
                                    '</div>');
                                this.myMark = this.addMaker(this.lat, this.lng, null, "assets/icon/mylocation.png", true);
                                this.pickUp(this.myMark);
                                return [2 /*return*/];
                            });
                        }); });
                        return [4 /*yield*/, SendPoint.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MapaPage.prototype.getLocalData = function () {
        return this.storage.get('cico');
    };
    MapaPage.prototype.setLocalData = function (user) {
        return this.storage.set('cico', user);
    };
    MapaPage.prototype.setLatLng = function (lat, lng) {
        this.lat = lat;
        this.lng = lng;
    };
    MapaPage.prototype.getLat = function () {
        return this.lat;
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
            Storage,
            AuthGuardService,
            ModalController])
    ], MapaPage);
    return MapaPage;
}());
export { MapaPage };
//# sourceMappingURL=mapa.page.js.map
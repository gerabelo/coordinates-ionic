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
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavParams, Platform, ToastController, ActionSheetController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpClient } from '@angular/common/http';
import { WsPontosService } from '../ws-pontos.service';
import { AuthGuardService } from '../auth-guard.service';
import { Md5 } from 'ts-md5/dist/md5';
var STORAGE_KEY = 'cico_images';
var ModalSendPointPage = /** @class */ (function () {
    function ModalSendPointPage(camera, file, http, webview, actionSheetController, toastController, storage, platform, loadingController, ref, filePath, wspontos, navCtrl, navParams, global, modal
    //fb: FormBuilder,
    ) {
        // this.urlBase = "http://192.168.0.112:3000/"
        // this.form = fb.group({
        //   tipo: {} as Type
        // });
        this.camera = camera;
        this.file = file;
        this.http = http;
        this.webview = webview;
        this.actionSheetController = actionSheetController;
        this.toastController = toastController;
        this.storage = storage;
        this.platform = platform;
        this.loadingController = loadingController;
        this.ref = ref;
        this.filePath = filePath;
        this.wspontos = wspontos;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.global = global;
        this.modal = modal;
        this.images = [];
        //public files: Array<String>;
        this.files = [];
        this.tipos = [];
        this.tipo = {};
        this.ponto = {};
    }
    ModalSendPointPage.prototype.ngOnInit = function () {
        var _this = this;
        // this.addPicture();
        this.platform.ready().then(function () {
            var position = _this.navParams.get("position"); //pega a posicao passada na chamada da Modal
            console.log("position: " + JSON.stringify(position));
            _this.ponto.lat = position.lat;
            _this.ponto.lng = position.lng;
            // this.ponto.files = [''];
            //this.ponto.typeId = '5c87da727eaf7075b3cebb5f';
            _this.wspontos.getTypes().subscribe(function (types) {
                types.forEach(function (type) {
                    _this.tipos.push(type);
                });
            });
            _this.loadStoredImages();
        });
    };
    ModalSendPointPage.prototype.onFormTipoChange = function ($event) {
        this.ponto.typeId = $event.target.value;
        //this.presentToast($event.target.value);
    };
    ModalSendPointPage.prototype.loadStoredImages = function () {
        var _this = this;
        this.storage.get(STORAGE_KEY).then(function (images) {
            if (images) {
                var arr = JSON.parse(images);
                _this.images = [];
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var img = arr_1[_i];
                    var filePath = _this.file.dataDirectory + img;
                    var resPath = _this.pathForImage(filePath);
                    _this.images.push({ name: img, path: resPath, filePath: filePath });
                }
            }
        });
    };
    ModalSendPointPage.prototype.pathForImage = function (img) {
        if (img === null) {
            return '';
        }
        else {
            var converted = this.webview.convertFileSrc(img);
            return converted;
        }
    };
    ModalSendPointPage.prototype.presentToast = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: text,
                            position: 'bottom',
                            duration: 3000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    ModalSendPointPage.prototype.selectImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actionSheet;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetController.create({
                            // header: "Selecione a origem das imagens:",
                            buttons: [{
                                    text: 'Galeria',
                                    handler: function () {
                                        _this.takePicture(_this.camera.PictureSourceType.PHOTOLIBRARY);
                                    }
                                }, {
                                    text: 'Camera',
                                    handler: function () {
                                        _this.takePicture(_this.camera.PictureSourceType.CAMERA);
                                    }
                                }, {
                                    text: 'Cancel',
                                    role: 'cancel'
                                }
                            ]
                        })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ModalSendPointPage.prototype.takePicture = function (sourceType) {
        var _this = this;
        this.camera.getPicture({
            quality: 50,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
            //destinationType: this.camera.DestinationType.FILE_URI,
            //encodingType: this.camera.EncodingType.JPEG,
            //mediaType: this.camera.MediaType.PICTURE,      
            //allowEdit: true,
            //targetHeight: 100,
            //targetWidth: 100
        }).then(function (imagePath) {
            //   var currentName = imagePath.substr(imagePath.lastIndexOf('/')+1);
            //   var correctPath = imagePath.substr(0,imagePath.lastIndexOf('/')+1);
            //   this.copyFileToLocalDir(correctPath,currentName,this.createFileName());
            //  }, (err) => {
            //   // Handle error
            //  });
            if (_this.platform.is('android') && sourceType === _this.camera.PictureSourceType.PHOTOLIBRARY) {
                _this.filePath.resolveNativePath(imagePath)
                    .then(function (filePath) {
                    var correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    var currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
                });
            }
            else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
            }
        });
    };
    ModalSendPointPage.prototype.copyFileToLocalDir = function (namePath, currentName, newFileName) {
        var _this = this;
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(function (_) {
            _this.updateStoredImages(newFileName);
        }, function (error) {
            _this.presentToast('Error while storing file.');
        });
    };
    ModalSendPointPage.prototype.updateStoredImages = function (name) {
        var _this = this;
        this.storage.get(STORAGE_KEY).then(function (images) {
            var arr = JSON.parse(images);
            if (!arr) {
                var newImages = [name];
                _this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
            }
            else {
                arr.push(name);
                _this.storage.set(STORAGE_KEY, JSON.stringify(arr));
            }
            var filePath = _this.file.dataDirectory + name;
            var resPath = _this.pathForImage(filePath);
            var newEntry = {
                name: name,
                path: resPath,
                filePath: filePath
            };
            _this.images = [newEntry].concat(_this.images);
            // this.ref.detectChanges(); // trigger change detection cycle
        });
    };
    ModalSendPointPage.prototype.deleteImage = function (imgEntry, position) {
        var _this = this;
        this.images.splice(position, 1);
        this.storage.get(STORAGE_KEY).then(function (images) {
            var arr = JSON.parse(images);
            var filtered = arr.filter(function (name) { return name != imgEntry.name; });
            _this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
            var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
            _this.file.removeFile(correctPath, imgEntry.name).then(function (res) {
                _this.presentToast('Imagem removida');
            });
        });
    };
    ModalSendPointPage.prototype.startUpload = function (imgEntries) {
        // if (!this.ponto.typeId) {
        //   this.presentToast('');
        // } else {}
        //return new Promise(async resolve => {
        // const loading = await this.loadingController.create({
        //   message: 'Uploading image...',
        // });
        // await loading.present();
        var _this = this;
        // for (let x = 0; x <= imgEntries.length ;x++) {
        //     this.file.resolveLocalFilesystemUrl(imgEntries[x].filePath)
        //     .then(entry => {
        //         entry['file'](file => {
        //           //this.ponto.files.push(this.readFile(file));
        //           //this.readFile(file,this.ponto.files[x])
        //           this.files.push("teste6")
        //           this.files.push(Md5.hashStr(file.name)+file.name);
        //           this.readFile(file)
        //         })
        //     })
        //     .catch(err => {
        //         this.presentToast('Error while reading file.');
        //     });
        // }
        imgEntries.forEach(function (imgEntry) {
            _this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
                .then(function (entry) {
                entry['file'](function (file) {
                    //this.ponto.files.push(this.readFile(file));
                    _this.readFile(file);
                });
            })
                .catch(function (err) {
                _this.presentToast('Error while reading file.');
            });
        });
        // loading.dismiss();            
        this.encerrarModel(imgEntries);
        //resolve(true);})    
    };
    ModalSendPointPage.prototype.readFile = function (file) {
        var _this = this;
        var res = '';
        var reader = new FileReader();
        reader.onloadend = function () { return __awaiter(_this, void 0, void 0, function () {
            var formData, imgBlob;
            return __generator(this, function (_a) {
                formData = new FormData();
                imgBlob = new Blob([reader.result], {
                    type: file.type
                });
                formData.set('file', imgBlob, file.name);
                // formData.set('file',imgBlob,remoteFileName);
                res = this.uploadData(formData);
                return [2 /*return*/];
            });
        }); };
        reader.readAsArrayBuffer(file);
        return res; //remover isto
    };
    ModalSendPointPage.prototype.uploadData = function (formData) {
        var _this = this;
        var result = '';
        this.http.post(this.wspontos.urlBase + 'files/upload/', formData)
            .subscribe(function (res) {
            if (res['status'] === 'success') {
                // result = res['description'];
                // this.presentToast(result);
                // this.ponto.files.push("img/"+result);
                // this.pushFileName("img/"+result);
                // this.files.push(result);
                _this.presentToast('File upload success.');
            }
            else {
                _this.presentToast('File upload failed.');
            }
        }, function (err) {
            //      this.presentToast(err.error)
            _this.presentToast(err.status);
        });
        return result;
        //let headers = new HttpHeaders({'Access-Control-Allow-Origin':'*'});
        // let headers = new HttpHeaders();
        // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    };
    ModalSendPointPage.prototype.createFileName = function () {
        var d = new Date(), n = d.getTime(), newFileName = n + ".jpg";
        return String(Md5.hashStr(newFileName));
    };
    ModalSendPointPage.prototype.pushFileName = function (filename) {
        //this.ponto.files = [filename, ... this.ponto.files];
        //this.ponto.files.push({url: 'img/'+filename});
        this.files.push(filename);
    };
    ModalSendPointPage.prototype.encerrarModel = function (imgEntries) {
        var _this = this;
        imgEntries.forEach(function (imgEntry) {
            // imgEntry.filename,imgEntry.filePath,
            _this.files = [_this.remoteFileName(imgEntry.name)].concat(_this.files);
        });
        var user = this.global.getUser();
        this.ponto.userId = user._id;
        this.ponto.files = this.files;
        //this.ponto.typeId = this.tipo._id;
        this.wspontos.sendPonto(this.ponto).subscribe(function (data) {
            console.log(JSON.stringify(data));
        }, function (err) {
            console.log(JSON.stringify(err));
        });
        this.modal.dismiss(this.ponto.typeId);
    };
    ModalSendPointPage.prototype.remoteFileName = function (filename) {
        var x = Md5.hashStr(filename) + filename;
        return x;
    };
    ModalSendPointPage = __decorate([
        Component({
            selector: 'app-modal-send-point',
            templateUrl: './modal-send-point.page.html',
            styleUrls: ['./modal-send-point.page.scss'],
        }),
        __metadata("design:paramtypes", [Camera,
            File,
            HttpClient,
            WebView,
            ActionSheetController,
            ToastController,
            Storage,
            Platform,
            LoadingController,
            ChangeDetectorRef,
            FilePath,
            WsPontosService,
            NavController,
            NavParams,
            AuthGuardService,
            ModalController
            //fb: FormBuilder,
        ])
    ], ModalSendPointPage);
    return ModalSendPointPage;
}());
export { ModalSendPointPage };
//# sourceMappingURL=modal-send-point.page.js.map
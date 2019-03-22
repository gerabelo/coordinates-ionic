var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCompass, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PopoverComponent } from './popover/popover.component';
import { ModalSendPointPageModule } from './modal-send-point/modal-send-point.module';
import { AuthGuardService } from './auth-guard.service';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicStorageModule } from '@ionic/storage';
library.add(faCompass, faInfoCircle);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [AppComponent, PopoverComponent],
            entryComponents: [
                PopoverComponent
            ],
            imports: [
                HttpClientModule,
                HttpModule,
                BrowserModule,
                IonicModule.forRoot(),
                AppRoutingModule,
                FontAwesomeModule,
                ModalSendPointPageModule,
                IonicStorageModule.forRoot()
                // IonicStorageModule.forRoot({
                // name: '__cico',
                //    driverOrder: ['indexeddb', 'sqlite', 'websql']
                // })
            ],
            providers: [
                StatusBar,
                SplashScreen,
                Geolocation,
                AuthGuardService,
                { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
                Camera, File, WebView, FilePath
            ],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map
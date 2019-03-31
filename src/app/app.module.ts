import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, GuardsCheckEnd } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCompass, faInfoCircle, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PopoverComponent } from './popover/popover.component';
import { ModalSendPointPageModule } from './modal-send-point/modal-send-point.module';
import { AuthGuardService } from './auth-guard.service';

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderForwardResult } from '@ionic-native/native-geocoder/ngx';

library.add(faCompass, faInfoCircle);

@NgModule({
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
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera, File, WebView, FilePath
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

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

import { AuthGuardService } from './auth-guard.service';

import { IonicStorageModule } from '@ionic/storage';

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
    IonicStorageModule.forRoot({
      name: '__cico',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AuthGuardService,    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

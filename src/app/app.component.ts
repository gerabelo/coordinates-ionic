import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
<<<<<<< HEAD
      url: '/home',
      icon: 'home'
=======
      url: '/mapa',
      icon: 'mapa'
>>>>>>> 47eaa016899c9598c7f1582eff4a060f20e93bbf
    },
    {
      title: 'Pontos',
      url: '/pontos',
      icon: ''
    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 47eaa016899c9598c7f1582eff4a060f20e93bbf

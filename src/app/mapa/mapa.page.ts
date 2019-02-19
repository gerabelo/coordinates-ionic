import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop, faBars } from '@fortawesome/free-solid-svg-icons';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { NavController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'mapa.page.html',
  styleUrls: ['mapa.page.scss'],
})

export class MapaPage implements OnInit {
  public pontos: Ponto[] = [];

  faCompass = faCompass;
  faInfoCircle = faInfoCircle;
  faChevronCircleLeft = faChevronCircleLeft;
  faMapMarker = faMapMarker;
  faPhone = faPhone;
  faRecycle = faRecycle;
  faDesktop = faDesktop;
  faBars = faBars;

  mapRef = null;

  myLatLng = null;
  // myLatLng: {
  //   lat: number,
  //   lng: number
  // }

  constructor(
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    public wspontos: WsPontosService,
    private navCtrl:NavController
  ) {

  }

  ngOnInit() {
    this.wspontos.getPontos().subscribe(data => {
      this.pontos = data;
    });

    this.loadMap();
  }

  async loadMap() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    this.myLatLng = await this.getLocation();
    const mapEle: HTMLElement = document.getElementById('map');
    this.mapRef = new google.maps.Map(mapEle, {
      center: this.myLatLng,
      zoom: 15
    });
    google.maps.event
    .addListenerOnce(this.mapRef, 'idle', () => {
      loading.dismiss();
      this.pontos.forEach(ponto => {
        this.addInfoWindow(
          this.mapRef,
          //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
          this.addMaker(+ponto.lat,+ponto.lng,null,ponto.type.icon),
          '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+ponto.description+'</h1>'+
            '<div id="bodyContent">'+
              '<p>'+ponto.address+'</p>'+
              '<p>'+ponto.phone+'</p>'+
              '<p>'+this.geodesicDistance(+ponto.lat,+ponto.lng)+' m</p>'+
            '</div>'+
          '</div>'
        );
      });
      this.addMaker(this.myLatLng.lat, this.myLatLng.lng,null,null);
    });
  }

  private addInfoWindow(map,marker,contentString: string) {
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.addListener('click', function() {
      infoWindow.open(map,marker);
    })
  }

  private addMaker(lat: number, lng: number, lbl: string, ico: string) {
    //https://developers.google.com/maps/documentation/javascript/markers
    //https://developers.google.com/maps/documentation/javascript/distancematrix
    //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      label: lbl,
      icon: ico
    });
    return marker;
  }

  private async getLocation() {
    const rta = await this.geolocation.getCurrentPosition();
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

  private geodesicDistance(lat: number,lng: number) {
    var R = 6371000; // metres
    var φ1 = this.toRad(lat);
    var φ2 = this.toRad(+this.myLatLng.lat);
    var Δφ = Math.sqrt(Math.pow(this.toRad(+this.myLatLng.lat)-this.toRad(lat),2));
    var Δλ = Math.sqrt(Math.pow(this.toRad(+this.myLatLng.lng)-this.toRad(lng),2));
    var a = Math.sin(Δφ/2)*Math.sin(Δφ/2)+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
    var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = (R * c).toFixed(1);
    
    return d;
  }

  public toRad(value: number) {
    return value * Math.PI / 180;
  }

  private goToList() {
    this.navCtrl.navigateForward('/pontos');
  }

  private goToAbout() {
    this.navCtrl.navigateForward('/about');
  }
}
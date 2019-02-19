import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Location} from '@angular/common';

@Component({
  selector: 'app-ponto',
  templateUrl: './ponto.page.html',
  styleUrls: ['./ponto.page.scss'],
})

export class PontoPage implements OnInit {
  ponto: Ponto;
  faCompass = faCompass;
  faInfoCircle = faInfoCircle;
  faChevronCircleLeft = faChevronCircleLeft;
  faMapMarker = faMapMarker;
  faPhone = faPhone;
  faRecycle = faRecycle;
  faDesktop = faDesktop;

  myLatLng = null;

  constructor(
    public wspontos: WsPontosService,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private _location: Location
  ) { }

  ngOnInit() {
    this.wspontos.getPonto(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(data => {
      this.ponto = data;
    });
    this.myLatLng = this.getLocation();
  }
  goback() {
    // this.navCtrl.navigateBack;
    this._location.back();
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

  private goToMapa() {
    this.navCtrl.navigateForward('/mapa');
  }

  private verificar() {}
  private goToWebsite() {}
  private verNoMapa() {}
  private ligar() {}
}
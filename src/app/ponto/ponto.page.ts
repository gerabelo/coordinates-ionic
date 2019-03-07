import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Location} from '@angular/common';
import { AuthGuardService } from '../auth-guard.service';

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

  myLatLng: {
    lat: number,
    lng: number
  };

  distance = null;

  constructor(
    public wspontos: WsPontosService,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private _location: Location,
    public authGuard: AuthGuardService
  ) { }

  ngOnInit() {

    if (this.authGuard.loginState) {
      this.wspontos.getPonto(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(data => {
        this.ponto = data;
  
        var p1 = new Promise(async (resolve,reject)=>{
          this.myLatLng = await this.getLocation();
          resolve(this.myLatLng);
          // reject(window.location.reload());
        });  
        p1.then(async (value: {lat:number, lng:number})=>{
            // console.log("value: "+JSON.stringify(value));
            // console.log("ponto: "+JSON.stringify(data));
            // console.log("lat lng: "+data.lat+" "+data.lng);
            // this.distance = await this.geodesicDistance(+data.lat,+data.lng);
            // console.log("distance: "+this.distance);
            var p2 = new Promise(async(sucess,fail)=>{
              var distancia = this.geodesicDistance(+data.lat,+data.lng,+value.lat,+value.lng);
              sucess(distancia);
            });
            p2.then((result)=>{
              console.log("value:"+result);
              this.distance = result;
            });
        });
      });
    } else {
      this.goToMapa();      
    }
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

  private geodesicDistance(lat1: number,lng1: number,lat2: number,lng2: number) {
    // console.log("lat lng: "+lat1+" "+lng1);
    var R = 6371000; // metres
    var φ1 = this.toRad(lat1);
    var φ2 = this.toRad(+lat2);
    var Δφ = Math.sqrt(Math.pow(this.toRad(+lat2)-this.toRad(lat1),2));
    var Δλ = Math.sqrt(Math.pow(this.toRad(+lng2)-this.toRad(lng1),2));
    var a = Math.sin(Δφ/2)*Math.sin(Δφ/2)+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
    var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = (R * c).toFixed(1);
    // console.log("φ1: "+φ1);
    // console.log("φ2: "+φ2);
    // console.log("Δφ: "+Δφ);
    // console.log("Δλ: "+Δλ);
    // console.log("c: "+c);
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
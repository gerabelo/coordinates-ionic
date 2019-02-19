import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { MenuController, NavController, PopoverController } from '@ionic/angular';
import { faCompass, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-pontos',
  templateUrl: './pontos.page.html',
  styleUrls: ['./pontos.page.scss'],
})

export class PontosPage implements OnInit {
  public pontos: Ponto[] = [];
  // public distances: string[] = [];
  public distances: Array<string> = [];
  faCompass = faCompass;
  faInfoCircle = faInfoCircle;

  // myLatLng: {
  //   lat: number,
  //   lng: number
  // }
  
  myLatLng = null;
  
  constructor(
    public wspontos: WsPontosService,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public popoverCtrl: PopoverController
  ) { this.loadPosition(); }

  ngOnInit(): void {
    
    this.wspontos.getPontos().subscribe(data => {
      this.pontos = data;
      console.log(data);
      this.myLatLng = this.getLocation().then(() => {
        this.pontos.forEach(ponto => {
          this.distances.push(this.geodesicDistance(+ponto.lat,+ponto.lng));
        });
      });
    });    
  }

  getPonto(id: string) {
    this.navCtrl.navigateForward('/ponto/'+id);
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

  private goToAbout() {
    this.navCtrl.navigateForward('/about');
  }

  private async getLocation() {
    const rta = await this.geolocation.getCurrentPosition();
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

  async loadPosition() {
    this.myLatLng = await this.getLocation();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });
    return await popover.present();
  }
}

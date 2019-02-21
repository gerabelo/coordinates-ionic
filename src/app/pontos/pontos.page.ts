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
  
  // myLatLng = null;
  
  constructor(
    public wspontos: WsPontosService,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit(): void {    
    this.wspontos.getPontos().subscribe(data => {
      this.pontos = data;
      console.log(data);
      var p1 = new Promise((resolve,reject)=>{
        var myLatLng = this.getLocation();
        resolve(myLatLng);
      });  
      p1.then((value: {lat:number,lng:number})=>{
        // console.log("value:"+JSON.stringify(value));
        this.pontos.forEach(ponto => {
          var p2 = new Promise((sucess,fail)=>{
            sucess(this.geodesicDistance(+ponto.lat,+ponto.lng,+value.lat,+value.lng));
          });
          p2.then((result:string)=>{
            console.log("value:"+result);
            this.distances.push(result);
          });
        });
      });
    });    
  }

  getPonto(id: string) {
    this.navCtrl.navigateForward('/ponto/'+id);
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

  // async loadPosition() {
  //   this.myLatLng = await this.getLocation();
  // }

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
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, PopoverController } from '@ionic/angular';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop, faBars } from '@fortawesome/free-solid-svg-icons';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { NavController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { AlertController } from '@ionic/angular';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { stringify } from '@angular/core/src/util';

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

  myMark = null;
  // myLatLng: {
  //   lat: number,
  //   lng: number
  // }

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    public wspontos: WsPontosService,
    private navCtrl:NavController,
    public popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private nativeGeocoder: NativeGeocoder
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
          this.addMaker(+ponto.lat,+ponto.lng,null,ponto.type.icon,false),
          '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+ponto.description+'</h1>'+
            '<div id="bodyContent">'+
              '<p>'+ponto.address+'</br>'+
              ponto.phone+'</br>'+
              this.geodesicDistance(+ponto.lat,+ponto.lng)+'m</p>'+
            '</div>'+
          '</div>'
        );
      });
      this.myMark = this.addMaker(this.myLatLng.lat, this.myLatLng.lng,null,"assets/icon/mylocation.png",true);
      this.pickUp(this.myMark);
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

  private addMaker(lat: number, lng: number, lbl: string, ico: string, drag) {
    //https://developers.google.com/maps/documentation/javascript/markers
    //https://developers.google.com/maps/documentation/javascript/distancematrix
    //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      label: lbl,
      icon: ico,
      animation: google.maps.Animation.DROP,
      draggable: drag
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

  async presentPopover(ev: any) {
    //popOver do ABOUT
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });
    return await popover.present();
  }

  private pickUp(marker) {
    var lat: number;
    var lng: number;

    google.maps.event.addListener(marker,'dragend',() => {
      lat = marker.position.lat();
      lng = marker.position.lng();
      this.sendPointConfirm(lat,lng);
    })
 
  }

  async sendPointConfirm(lat,lng) {
  //https://ionicframework.com/docs/v3/3.3.0/api/components/alert/AlertController/    
  //https://ionicframework.com/docs/native/native-geocoder/
    var endereco: string;
    this.nativeGeocoder.reverseGeocode(lat, lng, this.options)
    .then((result: NativeGeocoderReverseResult[]) => {
      endereco = JSON.stringify(result[0]);
      console.log(JSON.stringify(result[0]));
    })
    .catch((error: any) => console.log("error: "+error));
    console.log('endereco: '+endereco)
    const alert = await this.alertCtrl.create({
      //header: '[Novo Ponto]',
      message: `<p class='alert'><b>[Novo Ponto]</br></br>lat:</b> `+lat+`</br><b>lng:</b> `+lng+`</p>`,
      inputs: [
        {
          name: 'description',
          placeholder: 'descrição',
          type: 'text'
        },
        {
          name: 'phone',
          placeholder: 'contato',
          type: 'text'
        },
        {
          name: 'address',
          placeholder: 'endereço',
          type: 'text'
        },
        {
          name: 'website',
          type: 'url',
          placeholder: 'website'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Proximo',
          cssClass: 'alert-ok',
          handler: async data => {
            console.log('Send clicked');
            var status = 0;
            //var type = { id:'xyz', icon:'assets/icon/recycleBlueMarker.png'};
            const alert2 = await this.alertCtrl.create({
              message: `<p class='alert'><b>Informe o Tipo</p>`,
              inputs: [
                {
                  name: 'type',
                  label: 'Blue',
                  value: {id: '001', icon: 'assets/icon/recycleBlueMarker.png' },
                  type: 'radio',
                  checked: true
                },
                {
                  name: 'type',
                  label: 'Green',
                  value: {id: '002', icon: 'assets/icon/recycleGreenMarker.png' },
                  type: 'radio',
                },
                {
                  name: 'type',
                  label: 'Red',
                  value: {id: '003', icon: 'assets/icon/recycleRedMarker.png' },
                  type: 'radio',
                }
              ],
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'alert-cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Enviar',
                  cssClass: 'alert-ok',
                  handler: res => {
                    console.log(`res: `+JSON.stringify(res));  
                    //checkbox requires res[0].icon
                    var ponto = new Ponto(null,data.description,data.phone,data.address,lat,lng,status,res,data.website);
                    this.wspontos.sendCoordinate(ponto).subscribe( result => {
                      console.log('result: '+JSON.stringify(result));
                    });
                    //window.location.reload();
                    this.myMark.setMap(null);
                    this.addInfoWindow(
                      this.mapRef,
                      //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
                      this.addMaker(+ponto.lat,+ponto.lng,null,res.icon,false),
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
                    this.myMark = this.addMaker(this.myLatLng.lat, this.myLatLng.lng,null,"assets/icon/mylocation.png",true);
                    this.pickUp(this.myMark);
                  }
                }
              ]
            });
            return await alert2.present();
          }
        }
      ]
    });
    return await alert.present();
  }

}
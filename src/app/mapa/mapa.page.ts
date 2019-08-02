import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { LoadingController, PopoverController, Platform, IonApp, ToastController } from '@ionic/angular';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop, faBars, faListAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { NavController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { AlertController } from '@ionic/angular';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { stringify } from '@angular/core/src/util';
import { logging } from 'protractor';
import { Storage } from '@ionic/storage';
import { User } from '../user';
import { Type } from '../type';
import { Observable } from 'rxjs';
import { AuthGuardService } from '../auth-guard.service';
import { map, filter, scan, finalize } from 'rxjs/operators';
import { Entrada } from '../entrada';
import { AlertInput, ViewController } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { ModalSendPointPage } from '../modal-send-point/modal-send-point.page';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'mapa.page.html',
  styleUrls: ['mapa.page.scss'],
})

export class MapaPage implements OnInit {
  public pontos: Ponto[] = [];
  public tipos: Type[] = [];
  public users: User[] = [];
  public user: User;
  
  pontoUser;
  type;

  faCompass = faCompass;
  // faInfoCircle = faInfoCircle;
  faUser = faUser;
  faChevronCircleLeft = faChevronCircleLeft;
  faMapMarker = faMapMarker;
  faPhone = faPhone;
  faRecycle = faRecycle;
  faDesktop = faDesktop;
  // faBars = faBars;
  faListAlt = faListAlt;

  mapRef = null;
  myMark = null;
  lat: any;
  lng: any;

  constructor(
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    public wspontos: WsPontosService,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    // private nativeGeocoder: NativeGeocoder,
    private storage: Storage,
    public global: AuthGuardService,
    private platform: Platform,
    private router: Router,
    // private viewCtrl: ViewController,
    private appCtrl: IonApp,
    private toastController: ToastController,
    private modal: ModalController
  ) {
    // this.handleMarkerListenerClick = this.handleMarkerListenerClick.bind(this);
    this.navCtrl = navCtrl
  }

  ionViewDidEnter() {
    
    this.getLocalData().then((value) => {
      console.log('User: ', value);
      if (value == null) {
        this.user = null;
        this.global.setUser(null);
        this.login();        
      } else {
        // this.wspontos.fast(value.id).subscribe(usuario => {
        //   this.user = usuario;
        // })
        this.user = JSON.parse(value);
        this.global.setUser(JSON.parse(value));
      }      
    }).catch((err) => {
      this.login();              
    });
  }
  //  ionViewDidLoad() {
  ngAfterViewInit() {}

  ngOnInit() {    
    this.platform.ready().then(() => {    
      this.wspontos.getTypes()
      .pipe(
        filter((p) => p != undefined),
        finalize(()=>{
          this.wspontos.getPontos()
          .pipe(
            finalize(()=>{
              this.wspontos.getUsers()
              .pipe(
                //filter((p) => p != undefined),
                finalize(()=> this.loadMap())
              )
              .subscribe(data => {
                this.global.setUsers(data)
                this.users = data
              })
        

            })
          )
          .subscribe(data => {
            this.pontos = data;
            console.log("pontos: "+JSON.stringify(this.pontos))
          });
        })
      )
      .subscribe(types => {
        this.tipos = types;
        console.log("tipos: "+JSON.stringify(this.tipos))
      });
    })
  }

  private async login() {
    const alertLogin = await this.alertCtrl.create({
      backdropDismiss: false,
      // header: `Login`,
      inputs: [
        {
          name: 'api_key',
          // label: 'user',
          placeholder: 'user',
          type: 'text'
        },
        {
          name: 'password',
          // label: 'password',
          placeholder: 'password',
          type: 'password'
        }
      ], 
      buttons: [
        {
          text: 'Cadastrar',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            this.navCtrl.navigateForward('/cadastro');
          }
        },
        {
          text: 'Login',
          handler: (data) => {
            // console.log("login e pass: "+data.login+" "+data.password);
            this.wspontos.login(data.api_key,data.password).subscribe( usuario => {
              console.log('usuario: '+JSON.stringify(usuario));
              if (usuario == null) {
                this.user = null;
                this.global.setUser(null);
                this.login();
              } else {
                this.setLocalData(JSON.stringify(usuario));
                this.user = usuario;
                this.global.setUser(usuario);
              }
            });
          }
        }
      ]
    });
    return await alertLogin.present();
  }

  async loadMap() {
    //faz uso da watchPosition com clearWatch
    const loading = await this.loadingCtrl.create();
    loading.present();

    let watchOptions = {
      timeout : 30000,
      maxAge: 0,
      enableHighAccuracy: true
    };

    var watchID = navigator.geolocation.watchPosition((position) => {
///
      if ((position as Geoposition).coords != undefined) {
        var geoposition = (position as Geoposition);
        console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
      } else {
        console.log('falha ao obter posição')
      }
      
      this.setLatLng(geoposition.coords.latitude,geoposition.coords.longitude);
      const mapEle: HTMLElement = document.getElementById('map');
      this.mapRef = new google.maps.Map(mapEle, {
        center: {lat: geoposition.coords.latitude, lng: geoposition.coords.longitude},
        zoom: 11
      });

      google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
      
        loading.dismiss();
      
        if (this.pontos.length) {
          this.pontos.forEach(ponto => {
            console.log("ponto: "+JSON.stringify(ponto));
            this.type = this.tipos.find(x => x._id === ponto.typeId)
            this.pontoUser = this.users.find(x => x._id === ponto.userId)
            if (this.type != undefined && this.pontoUser != undefined) {  

              console.log("type: "+JSON.stringify(this.type));
              this.addInfoWindow (
                this.mapRef,
                this.addMaker(+ponto.lat,+ponto.lng,null,this.type.icon,false),
                '<div id="tap" value="'+ponto._id+'">'+
                  '<div>'+
                    '<h1 id="firstHeading" class="firstHeading">'+this.type.description+'</h1>'+
                    '<div id="bodyContent">'+
                      this.geodesicDistance(+ponto.lat,+ponto.lng)+' m</br>'+
                      this.pontoUser.api_key+
                    '</div>'+
                  '</div>'+
                '</div>'
              );
            }
          });
        }      
        console.log('lat: '+this.lat+' lng: '+this.lng);
        this.myMark = this.addMyMaker(this.lat, this.lng,null,"assets/icon/mylocation.png");
        this.pickUp(this.myMark);
      });
///
      navigator.geolocation.clearWatch(watchID);
    }, null , { enableHighAccuracy: true });
    // navigator.geolocation.clearWatch(watchID);
  }

  private addInfoWindow(map,marker,contentString: string) {
    var _this = this;
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.addListener('click', function() {
      infoWindow.open(map,marker);

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        
        document.getElementById('tap').addEventListener('click', () => {
          //_this.presentToast(document.getElementById('tap').getAttribute('value'));
          _this.navCtrl.navigateForward('/ponto/'+document.getElementById('tap').getAttribute('value'));
        },false);
      });
    });
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

  private addMyMaker(lat: number, lng: number, lbl: string, ico: string) {
    //https://developers.google.com/maps/documentation/javascript/markers
    //https://developers.google.com/maps/documentation/javascript/distancematrix
    //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      label: lbl,
      icon: ico,
      draggable: true
    });
    return marker;
  }

  private geodesicDistance(lat: number,lng: number) {
    var R = 6371000; // metres
    var φ1 = this.toRad(lat);
    // var φ2 = this.toRad(+this.myLatLng.lat);
    var φ2 = this.toRad(+this.lat);
    // var Δφ = Math.sqrt(Math.pow(this.toRad(+this.myLatLng.lat)-this.toRad(lat),2));
    // var Δλ = Math.sqrt(Math.pow(this.toRad(+this.myLatLng.lng)-this.toRad(lng),2));
    var Δφ = Math.sqrt(Math.pow(this.toRad(+this.lat)-this.toRad(lat),2));
    var Δλ = Math.sqrt(Math.pow(this.toRad(+this.lng)-this.toRad(lng),2));
    
    var a = Math.sin(Δφ/2)*Math.sin(Δφ/2)+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
    var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = (R * c).toFixed(1);
  
    return new Intl.NumberFormat('pt-br', {minimumFractionDigits: 2}).format(+d);
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
    
    // this.nativeGeocoder.reverseGeocode(lat, lng, this.options)
    // .then((result: NativeGeocoderReverseResult[]) => {
    //   console.log(JSON.stringify(result[0]));
    // }).catch(error=>{
    //   console.log(error);
    // });

    const SendPoint = await this.modal.create({
      component: ModalSendPointPage,
      componentProps: { position: { lat: lat, lng: lng } }
    });
  
    SendPoint.onDidDismiss().then(async res => {
      this.type = this.tipos.find(x => x._id == res.data[0]);
      this.pontoUser = this.users.find(x => x._id === res.data[1])
      // const alertType = await this.alertCtrl.create({  
      //   message: `<p><b>`+typeId['data']+`</p>`
      // });
      // return await alertType.present();
      if (this.type != undefined && this.pontoUser != undefined) {
        this.myMark.setMap(null);
        this.addInfoWindow(
          this.mapRef,
          this.addMaker(+lat,+lng,null,this.type.icon,false),
              '<div id="tap" value="'+res.data[2]+'">'+
                '<div>'+
                  '<h1 id="firstHeading" class="firstHeading">'+this.type.description+'</h1>'+
                  '<div id="bodyContent">'+
                    this.geodesicDistance(+lat,+lng)+' m</br>'+
                    this.pontoUser.login+
                  '</div>'+
                '</div>'+
              '</div>'
        );
        this.myMark = this.addMyMaker(this.lat, this.lng,null,"assets/icon/mylocation.png");
        this.pickUp(this.myMark);      
        //window.location.reload();
      }
      
    });
    
    return await SendPoint.present();  
    
  }

  getLocalData() {
    return this.storage.get('cico');
  }

  setLocalData(user: string){
    return  this.storage.set('cico',user);
  }

  setLatLng(lat,lng) {
    this.lat = lat;
    this.lng = lng;
  }

  getLat() {
    return this.lat;
  }

  gotoPonto(id: string) {
    this.navCtrl.navigateForward('/ponto/'+id);  
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }

  private async logout() {
    const alertLogout = await this.alertCtrl.create({
      backdropDismiss: false,
      message: '<b>'+this.user.username+'</b>, deseja realmente sair?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel',
          
        },
        {
          text: 'sair',
          handler: (data) => {
                this.user = null;
                this.global.setUser(null);
                this.storage.set('cico',this.user);
                this.login();              
          }
        }
      ]
    });

    return await alertLogout.present(); 
  }
}
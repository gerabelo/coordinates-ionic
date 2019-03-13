import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
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
import { logging } from 'protractor';
import { Camera, CameraOptions, DestinationType } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { User } from '../user';
import { Type } from '../type';
import { Observable } from 'rxjs';
import { AuthGuardService } from '../auth-guard.service';
import { map, filter, scan } from 'rxjs/operators';
import { Entrada } from '../entrada';
import { AlertInput } from '@ionic/core';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'mapa.page.html',
  styleUrls: ['mapa.page.scss'],
})

export class MapaPage implements OnInit {
  public pontos: Ponto[] = [];
  public tipos: Type[] = []; 
  public user: User;

  faCompass = faCompass;
  faInfoCircle = faInfoCircle;
  faChevronCircleLeft = faChevronCircleLeft;
  faMapMarker = faMapMarker;
  faPhone = faPhone;
  faRecycle = faRecycle;
  faDesktop = faDesktop;
  faBars = faBars;

  //logado = false;
  mapRef = null;
  myLatLng = null;
  myMark = null;
  lat
  lng 
  // myLatLng: {
  //   lat: number,
  //   lng: number
  // }

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
  }

  constructor(
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    public wspontos: WsPontosService,
    private navCtrl:NavController,
    public popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private nativeGeocoder: NativeGeocoder,
    private camera: Camera,
    private storage: Storage,
    public global: AuthGuardService
  ) { }

  // ionViewDidEnter() {
  //  ionViewDidLoad() {
    ngAfterViewInit() {
    this.getLocalData().then((value) => {
      console.log('cico: ', value);
      if (value == null) {
        this.user = null;
        this.global.setUser(null);
        //this.logado = false;
        this.login();        
      } else {
        // this.wspontos.fast(value.id).subscribe(usuario => {
        //   this.user = usuario;
        // })
        this.user = JSON.parse(value);
        this.global.setUser(JSON.parse(value));
        //this.logado = true;
      }      
    }).catch((err) => {
      //this.logado = false;
      this.login();              
    });
  }

  ngOnInit() {
    this.wspontos.getPontos().subscribe(data => {
      this.pontos = data;
    });
    //this.addPicture();
    //this.loadMap_old();
    this.loadMap();
  }

  private async login() {
    const alertLogin = await this.alertCtrl.create({
      backdropDismiss: false,
      // header: `Login`,
      // message: `<p class='alert'><b>Não há pontos para exibir!</p>`,          
      inputs: [
        {
          name: 'login',
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
            //this.logado = true;
            this.navCtrl.navigateForward('/cadastro');
          }
        },
        // {
        //   text: 'Cancelar',
        //   role: 'cancel',
        //   cssClass: 'alert-cancel',
        //   handler: () => {
        //     this.logado = false;
        //     this.login();
        //   }
        // },
        {
          text: 'Login',
          handler: (data) => {
            // if (data.login === 'root' && data.password === '123456') {
            //   this.logado = true;
              
            // } else {
            //   this.logado = false;
            //   this.login();
            // }
            this.wspontos.login(data.login,data.password).subscribe( usuario => {
              console.log('usuario: '+JSON.stringify(usuario));
              if (usuario == null) {
                this.user = null;
                this.global.setUser(null);
                //this.logado = false;
                this.login();
              } else {
                this.setLocalData(JSON.stringify(usuario));
                this.getLocalData().then((value) => {
                  console.log('cico: ', value);});
                this.user = usuario;
                this.global.setUser(usuario);
                //this.logado = true;
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
      }
      this.setLatLng(geoposition.coords.latitude,geoposition.coords.longitude);
      const mapEle: HTMLElement = document.getElementById('map');
      this.mapRef = new google.maps.Map(mapEle, {
        center: {lat: geoposition.coords.latitude, lng: geoposition.coords.longitude},
        zoom: 15
      });

      google.maps.event
      .addListenerOnce(this.mapRef, 'idle', () => {
        loading.dismiss();
        if (this.pontos.length) {
          this.pontos.forEach(ponto => {
            this.addInfoWindow(
              this.mapRef,
              //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
              this.addMaker(+ponto.lat,+ponto.lng,null,ponto.type.icon,false),
              // '<div id="infoWindow-'+ponto.type.id+'">'+
              '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">'+ponto.description+'</h1>'+
                '<div id="bodyContent">'+
                  '<p>'+ponto.address+'</br>'+
                  ponto.phone+'</br>'+
                  this.geodesicDistance(+ponto.lat,+ponto.lng)+'m</p>'+
                '</div>'+
                '<div id="tap">adicionar fotos</div>'+
                '</div>'
              );
            });
          }      
          console.log('lat: '+this.lat+' lng: '+this.lng);
          this.myMark = this.addMaker(this.lat, this.lng,null,"assets/icon/mylocation.png",true);
          this.pickUp(this.myMark);
      });
///
      navigator.geolocation.clearWatch(watchID);
    }, null , { enableHighAccuracy: true });
    // navigator.geolocation.clearWatch(watchID);
  }

  async loadMap_new() {
    //watchPosition sem clearWatch
    const loading = await this.loadingCtrl.create();
    loading.present();
    let watchOptions = {
      timeout : 30000,
      maxAge: 0,
      enableHighAccuracy: true
    };

    var watch = this.geolocation.watchPosition(watchOptions)
    .pipe(filter((p) => p.coords !== undefined)) //Filter Out Errors
    .subscribe((data) => {
      if ((data as Geoposition).coords != undefined) {
        var geoposition = (data as Geoposition);
        //this.myLatLng = { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude }
        console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
      }
      this.setLatLng(geoposition.coords.latitude,geoposition.coords.longitude);

      // console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
      const mapEle: HTMLElement = document.getElementById('map');
      this.mapRef = new google.maps.Map(mapEle, {
        center: {lat: geoposition.coords.latitude, lng: geoposition.coords.longitude},
        zoom: 15
      });

      google.maps.event
      .addListenerOnce(this.mapRef, 'idle', () => {
        loading.dismiss();
        if (this.pontos.length) {
          this.pontos.forEach(ponto => {
            this.addInfoWindow(
              this.mapRef,
              //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
              this.addMaker(+ponto.lat,+ponto.lng,null,ponto.type.icon,false),
              // '<div id="infoWindow-'+ponto.type.id+'">'+
              '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">'+ponto.description+'</h1>'+
                '<div id="bodyContent">'+
                  '<p>'+ponto.address+'</br>'+
                  ponto.phone+'</br>'+
                  this.geodesicDistance(+ponto.lat,+ponto.lng)+'m</p>'+
                '</div>'+
                '<div id="tap">adicionar fotos</div>'+
                '</div>'
              );
            });
          }      
          console.log('lat: '+this.lat+' lng: '+this.lng);
          this.myMark = this.addMaker(this.lat, this.lng,null,"assets/icon/mylocation.png",true);
          this.pickUp(this.myMark);
        });
      });
  }

  async loadMap_old() {
    //faz uso da versao antiga da getLocation que, por sua vez, utiliza GetCurrentPosition ao invés de WatchPosition
    const loading = await this.loadingCtrl.create();
    loading.present();
    try {
      this.myLatLng = await this.getLocation_old();
    } finally {
      const mapEle: HTMLElement = document.getElementById('map');
      this.mapRef = new google.maps.Map(mapEle, {
        center: this.myLatLng,
        zoom: 15
      });      
    }
    
    google.maps.event
    .addListenerOnce(this.mapRef, 'idle', () => {
      loading.dismiss();
      if (this.pontos.length) {
        this.pontos.forEach(ponto => {
          this.addInfoWindow(
            this.mapRef,
            //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
            this.addMaker(+ponto.lat,+ponto.lng,null,ponto.type.icon,false),
            // '<div id="infoWindow-'+ponto.type.id+'">'+
            '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">'+ponto.description+'</h1>'+
              '<div id="bodyContent">'+
                '<p>'+ponto.address+'</br>'+
                ponto.phone+'</br>'+
                this.geodesicDistance(+ponto.lat,+ponto.lng)+'m</p>'+
              '</div>'+
              '<div id="tap">adicionar fotos</div>'+
            '</div>'
          );
        });
      }      
    
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

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('tap').addEventListener('click', () => {
          alert('Clicked');
          //this.addPicture();
          console.log("touch");
          //this.closeInfoViewWindow(infoWindow);
          //this.openEventDetailModal(event);
        });
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

  private async getLocation_old() {
    const rta = await this.geolocation.getCurrentPosition();
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

  private async getLocation() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    let watchOptions = {
      timeout : 30000,
      maxAge: 0,
      enableHighAccuracy: true
    };

    const watch = this.geolocation.watchPosition(watchOptions)
    .pipe(filter((p) => p.coords !== undefined)) //Filter Out Errors
    .subscribe((data) => {
      if ((data as Geoposition).coords != undefined) {
        var geoposition = (data as Geoposition);
        //this.myLatLng = { lat: geoposition.coords.latitude, lng: geoposition.coords.longitude }
        console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
      }
      this.setLatLng(geoposition.coords.latitude,geoposition.coords.longitude);
      this.myLatLng = {lat:geoposition.coords.latitude, lng: geoposition.coords.longitude }  
      this.lat = geoposition.coords.latitude;
      this.lng = geoposition.coords.longitude;
      // console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude);
      const mapEle: HTMLElement = document.getElementById('map');
      this.mapRef = new google.maps.Map(mapEle, {
        center: {lat: geoposition.coords.latitude, lng: geoposition.coords.longitude},
        zoom: 15
      });

      
      google.maps.event
      .addListenerOnce(this.mapRef, 'idle', () => {
        loading.dismiss();
        if (this.pontos.length) {
          this.pontos.forEach(ponto => {
            this.addInfoWindow(
              this.mapRef,
              //this.addMaker(+ponto.lat,+ponto.lng,ponto.description,ponto.type.icon),
              this.addMaker(+ponto.lat,+ponto.lng,null,ponto.type.icon,false),
              // '<div id="infoWindow-'+ponto.type.id+'">'+
              '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
              '<h1 id="firstHeading" class="firstHeading">'+ponto.description+'</h1>'+
              '<div id="bodyContent">'+
                '<p>'+ponto.address+'</br>'+
                ponto.phone+'</br>'+
                this.geodesicDistance(+ponto.lat,+ponto.lng)+'m</p>'+
              '</div>'+
              '<div id="tap">adicionar fotos</div>'+
            '</div>'
          );
        });
      }      
      console.log('lat: '+this.lat+' lng: '+this.lng);
      this.myMark = this.addMaker(this.lat, this.lng,null,"assets/icon/mylocation.png",true);
      this.pickUp(this.myMark);
    });


    });

      
    //   // // data can be a set of coordinates, or an error (if an error occurred).
      // // data.coords.latitude
      // // data.coords.longitude

      // console.log("data.coords.latitude: "+data.coords.latitude);
      // return { lat: data.coords.latitude, lng: data.coords.longitude }
      // // latitude = data.coords.latitude;
      // // longitude = data.coords.longitude;
  
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
      console.log('endereco: '+endereco);
    })
    .catch((error: any) => console.log("error: "+error));
    console.log('endereco: '+endereco)
    const alertNovoPonto = await this.alertCtrl.create({
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
        // {
        //   name: 'address',
        //   placeholder: 'endereço',
        //   type: 'text'
        // },
        // {
        //   name: 'website',
        //   type: 'url',
        //   placeholder: 'website'
        // }
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
            var status = 0;
              this.wspontos.getTypes().subscribe(async types => {
                this.tipos = types;
                var alertInputs: AlertInput[] = [];
                this.tipos.forEach((tipo) => {
                  alertInputs.push({
                    type: "radio",
                    name: "type",
                    placeholder: "",
                    value: { id: tipo.id, icon: tipo.icon },
                    label: String(tipo.description),
                    checked: false,
                    disabled: false,
                    id: "",
                    handler: null,
                    min: "",
                    max: ""
                  });
                }); 
                console.log("alertInputs 1: "+JSON.stringify(alertInputs));

                const alertType = await this.alertCtrl.create({
                  message: `<p class='alert'><b>Informe o Tipo</p>`,
                  inputs: alertInputs,
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
                      // role: 'ok',
                      // cssClass: 'alert-ok',
                      handler: res => {
                        // console.log(`res: `+JSON.stringify(res));  
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
                        this.myMark = this.addMaker(this.lat, this.lng,null,"assets/icon/mylocation.png",true);
                        this.pickUp(this.myMark);
                        return true;
                      }
                    }
                  ]
                });
                return await alertType.present();
              });  
            
            // this.tipos.forEach((tipo) => {
            //   let input: Entrada;
            //   input.name = new String('type');
            //   input.label = String(tipo.description);
            //   in;put.value.icon = String(tipo.icon);
            //   input.value.id = String(tipo.id);
            //   input.type = String(`radio`);
            //   input.checked = false;
            //   alertInputs.push(input);
            //   console.log('inputs: '+JSON.stringify(input));
            // });            

            //console.log('this.tipos 2: '+JSON.stringify(this.tipos));

            //var type = { id:'xyz', icon:'assets/icon/recycleBlueMarker.png'};
          }
        }
      ]
    });
    return await alertNovoPonto.present();
    
  }

  private addPicture() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
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
}
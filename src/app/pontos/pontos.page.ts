import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { User } from '../user';
import { MenuController, NavController, PopoverController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { faCompass, faInfoCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PopoverComponent } from '../popover/popover.component';
import { Storage } from '@ionic/storage';
import { Type } from '../type';
import { AuthGuardService } from '../auth-guard.service';
import { map, filter, scan, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pontos',
  templateUrl: './pontos.page.html',
  styleUrls: ['./pontos.page.scss'],
})

export class PontosPage implements OnInit {
  public pontos: Ponto[] = [];
  public tipos: Type[] = [];
  public users: User[] = [];
  public pts: {
    id: string,
    lat: number,
    lng: number,
    description: string,
    icon: string,
    username: string
  }[] = [];
  public distances: Array<string> = [];

  tipo;
  pontoUser;

  faCompass = faCompass;
  // faInfoCircle = faInfoCircle;
  faUser = faUser;

  myLatLng;

  constructor(
    public wspontos: WsPontosService,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public popoverCtrl: PopoverController,
    private toastController: ToastController,
    public global: AuthGuardService,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {
    
  }

  ngOnInit(): void {
    this.platform.ready().then(async() => {
      // this.myLatLng = this.getLocation();
      const loading = await this.loadingCtrl.create();
      loading.present();

      
      if (this.global.getLocation() == undefined) {
        this.global.setLocation(this.getLocation());
      }

      this.myLatLng = this.global.getLocation();

      // this.wspontos.getTypes().subscribe(types => {
      //   types.forEach(type => {
      //     this.tipos.push(type);
      //   })
      // });
      this.users = this.global.getUsers()
      if (this.users == undefined) {
        this.wspontos.getUsers()
        .pipe(
          filter((p) => p != undefined)
        )
        .subscribe(data => {
          this.global.setUsers(data)
          this.users = data
        })
      }

      this.wspontos.getTypes()
      .pipe(
        filter((p) => p !== undefined),
        finalize(()=>{
            this.wspontos.getPontos()
            .pipe(
              finalize(()=>loading.dismiss())
            )
            .subscribe(data => {
              this.pontos = data;
              if (this.pontos.length) {
                var p1 = new Promise((resolve,reject)=>{
                  this.myLatLng = this.global.getLocation();
                  if (this.myLatLng == undefined) {
                    this.myLatLng = this.getLocation();
                    this.global.setLocation(this.myLatLng)
                  }
                  resolve(this.global.getLocation());
                });  
                p1.then((value: {lat:number,lng:number})=>{

                  this.pontos.forEach(ponto => {
                    var p2 = new Promise((sucess,fail)=>{
                      sucess(this.geodesicDistance(+ponto.lat,+ponto.lng,+value.lat,+value.lng));
                      fail("-");
                    });
                    p2.then((result:string)=>{
                      console.log("value:"+result);
                      if (+result > 1000) {
                        let d = new Intl.NumberFormat('pt-br', {maximumFractionDigits: 2, minimumFractionDigits: 0}).format((+result/1000));
                        this.distances.push(d+'k');
                      } else {
                        let d = new Intl.NumberFormat('pt-br', {maximumFractionDigits: 2, minimumFractionDigits: 0}).format(+result);
                        this.distances.push(d);
                      }
                    });
                  });
                });
              } else {
                this.alertNoEntries();
              }      
              this.pontos.forEach(ponto => {
                this.tipo = this.tipos.find(x => x._id == ponto.typeId); 
                this.pontoUser = this.users.find(x => x._id == ponto.userId); 
                if (this.tipo != undefined && this.pontoUser != undefined) {
                  let lat = +ponto.lat,
                      lng = +ponto.lng,
                      id  = ponto._id,
                      description = this.tipo.description,
                      icon = this.tipo.icon
                  this.pts.push({lat: lat, lng: lng,id: id, description: description, icon: icon,username: this.pontoUser.login});
                } else {
                  // this.presentToast("Alguns Pontos podem não estar sendo exibidos.");
                  this.presentToast("Clique nos Pontos para visualizar seu conteúdo.");
                  //this.navCtrl.navigateForward('/mapa');
                }
              
                // console.log('ponto.id: '+ponto._id);
              })
            })
        })
      ) //Filter Out Errors
      .subscribe(types => {
        this.tipos = types;
      })
    })
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 2000
    });
    toast.present();
  }

  gotoPonto(id: string) {
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

  async alertNoEntries() {
    const alert2 = await this.alertCtrl.create({
      header: `Atenção`,
      message: `<p class='alert'><b>Não há pontos para exibir!</p>`,          
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    return await alert2.present();        
  }

  private async logout() {
    const alertLogout = await this.alertCtrl.create({
      backdropDismiss: false,
      message: '<b>'+this.global.getUser().username+'</b>, deseja realmente sair?',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel',
          
        },
        {
          text: 'sair',
          handler: (data) => {
                this.global.setUser(null);
                this.storage.set('cico',null);
                this.goToMapa();
          }
        }
      ]
    });

    return await alertLogout.present(); 
  }
}
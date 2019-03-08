import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { WsPontosService } from '../ws-pontos.service';
import {Md5} from 'ts-md5/dist/md5';
import { NavController } from '@ionic/angular';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop, faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthGuardService } from '../auth-guard.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  public newUser = new User();
  //public newUser = this.global.getUser;

  faCompass = faCompass;
  faInfoCircle = faInfoCircle;
  faChevronCircleLeft = faChevronCircleLeft;
  faMapMarker = faMapMarker;
  faPhone = faPhone;
  faRecycle = faRecycle;
  faDesktop = faDesktop;
  faBars = faBars;

  constructor(
    private navCtrl:NavController,
    public wspontos: WsPontosService,
    private storage: Storage,
    public global: AuthGuardService
  ) { }

  ngOnInit() {
    this.newUser.status = "1";
  }

  cadastro() {
    let password = String(this.newUser.password);
    this.newUser.password = String(Md5.hashStr(password));
    console.log(JSON.stringify(this.newUser));
    this.wspontos.cadastro(this.newUser).subscribe(data => {
      if (data == null) {
        location.reload();
      } else {
        this.global.setUser(this.newUser);
        this.storage.set('cico',this.newUser);
        this.navCtrl.navigateForward('/mapa');
      }
    });
  }
}
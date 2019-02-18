import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { MenuController, NavController } from '@ionic/angular';
import { faCompass, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pontos',
  templateUrl: './pontos.page.html',
  styleUrls: ['./pontos.page.scss'],
})

export class PontosPage implements OnInit {
  public pontos: Ponto[] = [];
  faCompass = faCompass;
  faInfoCircle = faInfoCircle;

  constructor(public wspontos: WsPontosService, public navCtrl: NavController) {  }

  ngOnInit(): void {
    this.wspontos.getPontos().subscribe(data => {
      this.pontos = data;
      console.log(data);
    });
  }

  getPonto(id: string) {
    this.navCtrl.navigateForward('/ponto/'+id);
  }
}

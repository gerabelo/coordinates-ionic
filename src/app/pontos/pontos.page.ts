import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-pontos',
  templateUrl: './pontos.page.html',
  styleUrls: ['./pontos.page.scss'],
})

export class PontosPage implements OnInit {
  public pontos: Ponto[] = [];


  constructor(public wspontos: WsPontosService, public navCtrl: NavController) {  }

  ngOnInit(): void {
    this.wspontos.getPontos().subscribe(data => {
      this.pontos = data;
      console.log(data);
    });
  }

  getPonto(id: string) {
    // this.wspontos.getPonto(id).subscribe(data => {
    //   ponto = data;
    //   console.log(ponto);
    // });
    //this.navCtrl.navigateForward('ponto/'+this.pontos.find(ponto => ponto.id === id));
    this.navCtrl.navigateForward('/ponto/'+id);
  }
}

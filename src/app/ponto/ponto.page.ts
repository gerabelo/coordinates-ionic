import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { faCompass, faInfoCircle, faChevronCircleLeft, faMapMarker, faPhone, faRecycle, faDesktop } from '@fortawesome/free-solid-svg-icons';

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

  constructor(
    public wspontos: WsPontosService,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
  ) { }
  ngOnInit() {
    this.wspontos.getPonto(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(data => {
      this.ponto = data;
    });
  }
  goback() {
    this.navCtrl.navigateBack;
  }
}
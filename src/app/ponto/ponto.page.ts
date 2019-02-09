import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';
import { MenuController, NavController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-ponto',
  templateUrl: './ponto.page.html',
  styleUrls: ['./ponto.page.scss'],
})

export class PontoPage implements OnInit {
  ponto: Ponto;
  passedId: string;

  constructor(
    public wspontos: WsPontosService,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit() {
    // this.ponto = this.activatedRoute.paramMap.pipe(
    //   switchMap((params: ParamMap) => 
    //     this.wspontos.getPonto(params.get('id'))      
    //   )
    // );
    
    //this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.passedId = this.activatedRoute.snapshot.paramMap.get('id');
    this.wspontos.getPonto(this.passedId).subscribe(data => {
      this.ponto = data;
    });
    
  }
}



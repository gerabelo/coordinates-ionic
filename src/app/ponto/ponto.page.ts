import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';

@Component({
  selector: 'app-ponto',
  templateUrl: './ponto.page.html',
  styleUrls: ['./ponto.page.scss'],
})

export class PontoPage implements OnInit {
  public ponto: Ponto;
  constructor(public wspontos: WsPontosService) { }
  
  ngOnInit(): void {
    this.wspontos.getPonto().subscribe(data => {
      this.ponto = data;
    });
  }
}

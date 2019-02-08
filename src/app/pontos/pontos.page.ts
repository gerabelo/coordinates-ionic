import { Component, OnInit } from '@angular/core';
import { WsPontosService } from '../ws-pontos.service';
import { Ponto } from '../ponto';

@Component({
  selector: 'app-pontos',
  templateUrl: './pontos.page.html',
  styleUrls: ['./pontos.page.scss'],
})

export class PontosPage implements OnInit {
  public pontos: Ponto[] = [];
  constructor(public wspontos: WsPontosService) {  }

  ngOnInit(): void {
    this.wspontos.getPontos().subscribe(data => {
      this.pontos = data;
      console.log(data);
    });
  }
}

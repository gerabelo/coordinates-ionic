import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { Ponto } from './ponto';
// import { PontoPage } from './ponto/ponto.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mapa',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './mapa/mapa.module#MapaPageModule'
  },
  { 
    path: 'ponto/:id',
    loadChildren: './ponto/ponto.module#PontoPageModule'
  },
  { 
    path: 'pontos',
    loadChildren: './pontos/pontos.module#PontosPageModule'
  },
  { path: 'mapa', loadChildren: './mapa/mapa.module#MapaPageModule' },
  { path: 'cadastro', loadChildren: './cadastro/cadastro.module#CadastroPageModule' },  { path: 'modal-send-point', loadChildren: './modal-send-point/modal-send-point.module#ModalSendPointPageModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

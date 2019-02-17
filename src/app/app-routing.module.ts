import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ponto } from './ponto';
import { PontoPage } from './ponto/ponto.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { 
    path: 'ponto/:id',
    loadChildren: './ponto/ponto.module#PontoPageModule'
  },
  { 
    path: 'pontos',
    loadChildren: './pontos/pontos.module#PontosPageModule'
  },
  { path: 'mapa', loadChildren: './mapa/mapa.module#MapaPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
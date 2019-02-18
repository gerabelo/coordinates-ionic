import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD
import { Ponto } from './ponto';
import { PontoPage } from './ponto/ponto.page';
=======
// import { Ponto } from './ponto';
// import { PontoPage } from './ponto/ponto.page';
>>>>>>> 47eaa016899c9598c7f1582eff4a060f20e93bbf

const routes: Routes = [
  {
    path: '',
<<<<<<< HEAD
    redirectTo: 'home',
=======
    redirectTo: 'mapa',
>>>>>>> 47eaa016899c9598c7f1582eff4a060f20e93bbf
    pathMatch: 'full'
  },
  {
    path: 'home',
<<<<<<< HEAD
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
=======
    loadChildren: './mapa/mapa.module#MapaPageModule'
>>>>>>> 47eaa016899c9598c7f1582eff4a060f20e93bbf
  },
  { 
    path: 'ponto/:id',
    loadChildren: './ponto/ponto.module#PontoPageModule'
  },
  { 
    path: 'pontos',
    loadChildren: './pontos/pontos.module#PontosPageModule'
<<<<<<< HEAD
  }
=======
  },
  { path: 'mapa', loadChildren: './mapa/mapa.module#MapaPageModule' }
>>>>>>> 47eaa016899c9598c7f1582eff4a060f20e93bbf
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
<<<<<<< HEAD
export class AppRoutingModule {}
=======
export class AppRoutingModule {}
>>>>>>> 47eaa016899c9598c7f1582eff4a060f20e93bbf

import { Routes } from '@angular/router';
import { SkeletonComponent } from './shared/components/layouts/skeleton/skeleton.component';
import { LoginComponent } from './components/login/login.component';
import { LoginGuard } from './core/guards/login.guard';
import { HomeComponent } from './pages/home/home.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { OrdenComponent } from './pages/orden/orden.component';
import { rutaGuard } from './core/guards/rutas.guard';
import { ProduccionComponent } from './pages/produccion/produccion.component';


export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate:[LoginGuard]
  },
  {
    path:'',
    component:SkeletonComponent,
    children:[
      {
        path:'inicio',
        component:HomeComponent
      },
      {
        path:'inventario',
        component:InventarioComponent,
        canActivate:[rutaGuard],
        data: { expectedRol: ['BODEGA'] },
      },
      {
        path:'ordenes',
        component:OrdenComponent
      },
      {
        path:'produccion',
        component:ProduccionComponent
      }
    ]
  }
];

import { Routes } from '@angular/router';
import { SkeletonComponent } from './shared/components/layouts/skeleton/skeleton.component';
import { LoginComponent } from './components/login/login.component';
import { LoginGuard } from './core/guards/login.guard';
import { HomeComponent } from './pages/home/home.component';


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
      }
    ]
  }
];

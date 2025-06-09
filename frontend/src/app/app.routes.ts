import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'poi/:id',
    loadComponent: () => import('./pages/detail/detail.page').then( m => m.DetailPage)
  },
  {
    path: 'add-poi',
    loadComponent: () => import('./pages/add-poi/add-poi.page').then( m => m.AddPoiPage)
  },
  {
    path: 'search-poi',
    loadComponent: () => import('./pages/search-poi/search-poi.page').then( m => m.SearchPoiPage)
  },
];

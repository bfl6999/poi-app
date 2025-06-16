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
  {
    path: 'edit-poi/:id',
    loadComponent: () => import('./pages/edit-poi/edit-poi.page').then( m => m.EditPoiPage)
  },
  {
    path: 'generate-route',
    loadComponent: () => import('./pages/generate-route/generate-route.page').then( m => m.GenerateRoutePage)
  },
  {
    path: 'user-pois',
    loadComponent: () => import('./pages/user-pois/user-pois.page').then( m => m.UserPoisPage)
  },
];

import { Routes } from '@angular/router';
import { ProductDetail } from './pages/product-detail/product-detail';
import { ProductList } from './pages/product-list/product-list';

export const routes: Routes = [
  {
    path: '',
    component: ProductList
  },
  {
    path: 'product/:id',
    component: ProductDetail
  },
  {
    path: '**',
    redirectTo: ''
  }
];
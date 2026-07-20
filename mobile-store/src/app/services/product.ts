import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/product`);
  }

  getProduct(productId : string) {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/product/${productId}`);
  }

  /*addToCart() {
    return this.http.post<Product[]>(`${environment.apiUrl}/product`);
  }*/
}

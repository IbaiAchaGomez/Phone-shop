import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/Product';
import { ProductDetailModel } from '../../models/ProductDetailModel';
import { CartRequest } from '../../models/requests/CartRequest';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/product`);
  }

  getProduct(productId : string) {
    return this.http.get<ProductDetailModel>(`${environment.apiUrl}/api/product/${productId}`);
  }
  
}

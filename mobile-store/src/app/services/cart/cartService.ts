import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartRequest } from '../../models/requests/CartRequest';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  addToCart(product: CartRequest): Observable<any> {
    return this.http.post<CartRequest>(`${environment.apiUrl}/product`, product);
  }
}

import { inject, Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class CartStateService {

  private readonly STORAGE_KEY = 'cartItems';
  private readonly TTL = 30 * 60 * 1000;

  cartItems = signal(this.loadCartItems());

  setCartItems(count: number) {
    this.cartItems.set(count);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      count,
      expiresAt: Date.now() + this.TTL
    }));
  }

  private loadCartItems(): number {
    const value = localStorage.getItem(this.STORAGE_KEY);

    if (!value) {
      return 0;
    }

    try {
      const item = JSON.parse(value);

      if (Date.now() > item.expiresAt) {
        localStorage.removeItem(this.STORAGE_KEY);
        return 0;
      }

      return item.count;
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
      return 0;
    }
  }

  clear() {
    this.cartItems.set(0);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

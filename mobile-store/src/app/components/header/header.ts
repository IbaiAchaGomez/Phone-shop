import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { CartStateService } from '../../services/cart/cartStateService';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private location = inject(Location)
  breadcrumb = input<string>('');
  private cartStateService = inject(CartStateService);

  cartItems = this.cartStateService.cartItems;
  
  goBack(): void {
    this.location.back();
  }
}

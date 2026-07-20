import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  private router = inject(Router);
  product = input.required<Product>();

  goToDetail(): void {
    this.router.navigate(['/product', this.product().id]);
  }
}

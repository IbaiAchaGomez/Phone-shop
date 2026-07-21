import { Component, computed, inject, signal  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../../components/header/header';
import { ProductDetailModel } from '../../models/ProductDetailModel';
import { ProductService } from '../../services/product/productService';
import { CartService } from '../../services/cart/cartService';
import { CartRequest } from '../../models/requests/CartRequest';
import { CartStateService } from '../../services/cart/cartStateService';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    Header
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cartStateService = inject(CartStateService);

  product = signal<ProductDetailModel | undefined>(undefined);
  selectedColor = signal<number | undefined>(undefined);
  selectedStorage = signal<number | undefined>(undefined);
  primaryCamera?: string[] | string;

  loading = signal(true);
  addingToCart = signal(false);
  showConfirmDialog = signal(false);

  primaryCameraText = computed(() => {
  const cam = this.product()?.primaryCamera;

  if (!cam) return 'No disponible';
  if (Array.isArray(cam)) {
    return cam.length > 0 ? cam.join(', ') : 'No disponible';
  }
  return cam;
  });

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.loadProduct(id);
  }

  private loadProduct(id: string): void {

    this.productService.getProduct(id).subscribe({

      next: (product: ProductDetailModel) => {
        this.product.set(product);
        this.selectedColor.set(product.options.colors?.[0]?.code);
        this.selectedStorage.set(product.options.storages?.[0]?.code);
        this.loading.set(false);
      },

      error: (err) => {
        console.error('Error cargando el producto', err);
        this.loading.set(false);
      }

    });

  }
  canAddToCart = computed(() => {
    const p = this.product();

    return p !== undefined
      && this.selectedColor() !== undefined
      && this.selectedStorage() !== undefined;
  });

  addToCart(): void {

    if (!this.canAddToCart()) {
      console.warn('No se puede añadir al carrito: faltan datos');
      return;
    }

    this.showConfirmDialog.set(true);
  }

  cancelAddToCart(): void {
    this.showConfirmDialog.set(false);
  }

  confirmAddToCart(): void {

    const p = this.product()!;

    this.addingToCart.set(true);
    this.showConfirmDialog.set(false);
    const cartProduct: CartRequest = {
      id: p.id,
      colorCode: this.selectedColor()!,
      storageCode: this.selectedStorage()!
    }

    this.cartService.addToCart(cartProduct).subscribe({
      next: (response) => {
        this.addingToCart.set(false);
        this.cartStateService.setCartItems(response.count);
        console.log('Producto añadido al carrito');
      },
      error: (err) => {
        this.addingToCart.set(false);
        console.error('Error al añadir al carrito', err);
      }
    });
  }
}
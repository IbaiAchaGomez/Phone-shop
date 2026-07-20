import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { Product } from '../../models/Product';
import { Header } from '../../components/header/header';
import { SearchBar } from '../../components/search-bar/search-bar';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product/productService';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [
    Header,
    SearchBar,
    ProductCard
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {

  ngOnInit() {
    this.loadProducts();
  }

  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  searchTerm = signal<string>('');
  loading = signal(true);

  filteredProducts = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    if (!search) {
      return this.products();
    }

    return this.products().filter(product =>
      product.brand.toLowerCase().includes(search) ||
      product.model.toLowerCase().includes(search)
    );
  });

  private loadProducts(): void {

    this.productService.getProducts().subscribe({
        next: (products) => {
          this.products.set(products) ;
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
           this.loading.set(false);
        }
    });
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }
}

import { Component, OnDestroy, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatCardTitleGroup } from '@angular/material/card';
import { Product, ProductObject } from '../../shared/models/Product';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule,
    MatButtonModule,      
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit{
  products: Product[] = [];
  isLoading = true;
  filteredProducts: Product[] = [];
  maxPrice: number | null = null;
  currentUser: any = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        this.filteredProducts = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
    });
    try {
      this.currentUser = await this.authService.getCurrentUserId(); // Fetch the current user
      console.log('Current user:', this.currentUser);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }
  getFilteredProductsByPrice(): void {
    this.filteredProducts = this.productService.getFilteredProductsByPrice(
      this.products,
      this.maxPrice || Infinity
    );
  }
  
  addToCart(product: Product): void {
    if (this.currentUser !== null) {
      this.cartService.addToCart(product.id, this.currentUser);
    } else {
      console.error('User is not logged in.');
      alert('Please log in to add items to the cart.');
    }
    alert(`${product.name} hozzáadva a kosárhoz!`);
  }
  
  // trackByIndex(index: number, item: any): number {
  //   return index;
  // }
  // ProductObject = ProductObject; // ProA termékek tömbje
  // selectedIndex: number = 0; // Alapértelmezésben az első termék indexe
  // maxPrice: number = 0; // Alapértelmezett maximális ár
  // filteredProducts: Product[] = [...this.ProductObject];
  // categories: string[] = Array.from(new Set(this.ProductObject.map(product => product.category)));; // Kategóriák tömbje

  // ngOnInit(): void {

  // }
  // reload(index: number): void {
  //   // Ellenőrizzük, hogy az index érvényes-e
  //   if (index >= 0 && index < this.ProductObject.length) {
  //     this.selectedIndex = index; // Beállítjuk az új kiválasztott indexet
  //     console.log("Új selectedIndex:", index); // Ellenőrzéshez
  //   } else {
  //     console.error("Érvénytelen index:", index);
  //   }
  // }
  // getFilteredProducts(): void {
  //   console.log('Max Price:', this.maxPrice);
  //   console.log('All Products:', this.ProductObject);
  //   if (this.maxPrice !== null && !isNaN(this.maxPrice)) {
  //     this.filteredProducts = this.ProductObject.filter(product => product.price <= this.maxPrice);
  //   } else {
  //     this.filteredProducts = [...this.ProductObject];
  //   }
  // }
  // maxPrize(): void {
  //   console.log('Max Price:', this.maxPrice);
  //   if (this.maxPrice !== null && !isNaN(this.maxPrice)) {
  //     this.filteredProducts = this.ProductObject.filter(product => product.price <= this.maxPrice);
  //   } else {
  //     this.filteredProducts = [...this.ProductObject];
  //   }
  // }
  // selectedCategory(category: string): void {
  //   if (category) {
  //     this.filteredProducts = this.ProductObject.filter(product => product.category === category);
  //     console.log('Selected Category:', category);
  //   } else {
  //     this.filteredProducts = [...this.ProductObject];
  //   }
  // }
}


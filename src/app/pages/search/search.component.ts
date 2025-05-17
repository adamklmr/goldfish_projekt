import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ProductService } from '../../shared/services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../shared/models/Product';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CurrencyPipePipe } from '../../shared/pipes/currency.pipe.pipe';

@Component({
  selector: 'app-search',
  imports: [
    MatListModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    CurrencyPipePipe
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
    query: string = '';
    results: any[] = [];
  
    constructor(private productService: ProductService, private route: ActivatedRoute)
   {}
  
    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.query = params.get('query') || '';
  
        this.searchProducts(this.query);
      })
    }
  
    searchProducts(query: string): void {
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        const queryLower = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Normalize and remove accents
  
        const filteredProducts = products.filter((product: Product) => {
          const productCategory = product.category
            ? product.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Normalize and remove accents
            : ''; // Check if 'kategoria' exists
  
          const productName = product.name
            ? product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Normalize and remove accents
            : ''; // Check if 'termeknev' exists
  
          // Match either category or product name
          return productCategory.includes(queryLower) || productName.includes(queryLower);
        });
  
        console.log(`Filtered products for query "${query}":`, filteredProducts);
        this.results = filteredProducts; // Store the filtered products in the results array
      },
      error: (error: any) => {
        console.error("Error fetching products:", error);
      }
    });
    }
  
    isLoggedIn(): boolean {
      return localStorage.getItem('bejelentkezve-e') === 'true';
    }
  }
  